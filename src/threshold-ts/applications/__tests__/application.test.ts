import {
  ContractInterface,
  BigNumber,
  providers,
  ContractTransaction,
  Contract,
} from "ethers"
import { AddressZero, getContract, MAX_UINT64 } from "../../utils"
import { Application, IApplication, StakingProviderAppInfo } from ".."
import { IStaking } from "../../staking"
import { ContractCall, IMulticall } from "../../multicall"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))

describe("Application test", () => {
  let application: IApplication
  let staking: IStaking
  let mockMulticall: IMulticall

  const amount = BigNumber.from("123")
  const time = BigNumber.from("456")
  const address = AddressZero
  const account = "0xE775aE21E40d34f01A5C0E1Db9FB3e637D768596"
  const abi: ContractInterface = []
  const stakingProvider = "0x486b0ee2eed761f069f327034eb2ae5e07580bf3"
  const mockedEthereumProvider = {} as providers.Provider
  const mockStakingContract = {
    interface: {},
    address: "0x6A55B762689Ba514569E565E439699aBC731f156",
  }
  const currentBlockTimestampContractCall = {}
  const mockAppContract = {
    address,
    minimumAuthorization: jest.fn(),
    pendingAuthorizationDecrease: jest.fn(),
    remainingAuthorizationDecreaseDelay: jest.fn(),
    authorizationParameters: jest.fn(),
    stakingProviderToOperator: jest.fn(),
    isOperatorInPool: jest.fn(),
  }

  beforeEach(() => {
    staking = {
      authorizedStake: jest.fn(),
      increaseAuthorization: jest.fn(),
      stakingContract: mockStakingContract,
    } as unknown as IStaking
    ;(getContract as jest.Mock).mockImplementation(() => mockAppContract)
    mockMulticall = {
      aggregate: jest.fn(),
      getCurrentBlockTimestampCallObj: jest
        .fn()
        .mockReturnValue(currentBlockTimestampContractCall),
    }
    application = new Application(staking, mockMulticall, {
      address,
      abi,
      providerOrSigner: mockedEthereumProvider,
      chainId: "1",
      account,
    })
  })

  test("should create the Application instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      address,
      abi,
      mockedEthereumProvider,
      account
    )
    expect(application.address).toEqual(address)
    expect(application.contract).toEqual(mockAppContract)
  })

  test("should return the auhorized stake for a given staking provider", async () => {
    const stakingSpy = jest
      .spyOn(staking, "authorizedStake")
      .mockResolvedValue(amount)

    const result = await application.authorizedStake(stakingProvider)

    expect(stakingSpy).toHaveBeenCalledWith(
      stakingProvider,
      application.address
    )
    expect(result).toEqual(amount)
  })

  test("should return the minimum authorization amount", async () => {
    const minAuthSpy = jest
      .spyOn(mockAppContract, "minimumAuthorization")
      .mockResolvedValue(amount)

    const result = await application.minimumAuthorization()

    expect(minAuthSpy).toHaveBeenCalled()
    expect(result).toEqual(amount)
  })

  test("should return the amount being deauthorized for the staking provider.", async () => {
    const spy = jest
      .spyOn(mockAppContract, "pendingAuthorizationDecrease")
      .mockResolvedValue(amount)

    const result = await application.pendingAuthorizationDecrease(
      stakingProvider
    )

    expect(spy).toHaveBeenCalledWith(stakingProvider)
    expect(result).toEqual(amount)
  })

  test("should return the the time until the deauthorization can be completed.", async () => {
    const spy = jest
      .spyOn(mockAppContract, "remainingAuthorizationDecreaseDelay")
      .mockResolvedValue(time)

    const result = await application.remainingAuthorizationDecreaseDelay(
      stakingProvider
    )

    expect(spy).toHaveBeenCalledWith(stakingProvider)
    expect(result).toEqual(time)
  })

  test("should return authorization decrease delay in seconds between the time authorization decrease is requested and the time the authorization decrease can be approved.", async () => {
    const mockResult = {
      authorizationDecreaseDelay: time,
      minimumAuthorization: amount,
      authorizationDecreaseChangePeriod: time,
    }
    const spy = jest
      .spyOn(mockAppContract, "authorizationParameters")
      .mockResolvedValue(mockResult)

    const result = await application.authorizationDecreaseDelay()

    expect(spy).toHaveBeenCalled()
    expect(result).toEqual(mockResult.authorizationDecreaseDelay)
  })

  describe("rewards eligibility", () => {
    test("should return true if the operator exists for a given staking provider and operator is in the pool.", async () => {
      const operator = "0xeCbEb9B6Aa18dD3B57ECD061490ae5029c05EC91"
      const isInPool = true
      const spyOnOperatorMap = jest
        .spyOn(mockAppContract, "stakingProviderToOperator")
        .mockResolvedValue(operator)

      const spyOnPool = jest
        .spyOn(mockAppContract, "isOperatorInPool")
        .mockResolvedValue(isInPool)

      const result = await application.isEligibleForRewards(stakingProvider)

      expect(spyOnOperatorMap).toHaveBeenCalledWith(stakingProvider)
      expect(spyOnPool).toHaveBeenCalledWith(operator)
      expect(result).toBeTruthy()
    })

    test("should return false if the operator doesn't exist for a given staking provider.", async () => {
      const operator = AddressZero
      const spyOnOperatorMap = jest
        .spyOn(mockAppContract, "stakingProviderToOperator")
        .mockResolvedValue(operator)

      const spyOnPool = jest.spyOn(mockAppContract, "isOperatorInPool")

      const result = await application.isEligibleForRewards(stakingProvider)

      expect(spyOnOperatorMap).toHaveBeenCalledWith(stakingProvider)
      expect(spyOnPool).not.toHaveBeenCalled()
      expect(result).toBeFalsy()
    })
  })

  test("should return authorization-related parameters", async () => {
    const mockResult = {
      authorizationDecreaseDelay: time,
      minimumAuthorization: amount,
      authorizationDecreaseChangePeriod: time,
    }
    const spy = jest
      .spyOn(mockAppContract, "authorizationParameters")
      .mockResolvedValue(mockResult)

    const result = await application.authorizationParameters()

    expect(spy).toHaveBeenCalled()
    expect(result).toEqual(mockResult)
  })

  describe("getting the staking provider app info", () => {
    const currentBlockTimestamp = 100
    const authorizationDecreaseDelay = 20
    const remainingAuthorizationDecreaseDelay = 30
    const createdAt =
      currentBlockTimestamp +
      remainingAuthorizationDecreaseDelay -
      authorizationDecreaseDelay
    const testCases = [
      {
        remainingAuthorizationDecreaseDelay: MAX_UINT64,
        expectedValue: {
          isDeauthorizationReqestActive: false,
          deauthorizationCreatedAt: undefined,
        },
        testMessage:
          "when the deauthorization request has not been activated yet",
      },
      {
        remainingAuthorizationDecreaseDelay: 0,
        expectedValue: {
          isDeauthorizationReqestActive: true,
          deauthorizationCreatedAt: undefined,
        },
        testMessage:
          "when the deauthorization request has been activated and can be approved",
      },
      {
        remainingAuthorizationDecreaseDelay,
        expectedValue: {
          isDeauthorizationReqestActive: true,
          deauthorizationCreatedAt: BigNumber.from(createdAt),
        },
        testMessage:
          "when the deauthorization request has been activated but the authorization decrease delay not passed",
      },
    ]
    test.each`
      remainingAuthorizationDecreaseDelay                 | expectedValue                 | testMessage
      ${testCases[0].remainingAuthorizationDecreaseDelay} | ${testCases[0].expectedValue} | ${testCases[0].testMessage}
      ${testCases[1].remainingAuthorizationDecreaseDelay} | ${testCases[1].expectedValue} | ${testCases[1].testMessage}
      ${testCases[2].remainingAuthorizationDecreaseDelay} | ${testCases[2].expectedValue} | ${testCases[2].testMessage}
    `(
      "should return the staking provider app info $testMessage",
      async ({ remainingAuthorizationDecreaseDelay, expectedValue }) => {
        const authorizedStake = amount
        const pendingAuthorizationDecrease = time
        const authParameters = {
          authorizationDecreaseDelay,
        }
        const multicallResult = [
          authorizedStake,
          pendingAuthorizationDecrease,
          remainingAuthorizationDecreaseDelay,
          currentBlockTimestamp,
          authParameters,
        ]

        const multicallSpy = jest
          .spyOn(mockMulticall, "aggregate")
          .mockResolvedValue(multicallResult)

        const result = await application.getStakingProviderAppInfo(
          stakingProvider
        )

        expect(multicallSpy).toHaveBeenCalledWith([
          {
            interface: mockStakingContract.interface,
            address: mockStakingContract.address,
            method: "authorizedStake",
            args: [stakingProvider, application.address],
          },
          {
            interface: application.contract.interface,
            address: application.address,
            method: "pendingAuthorizationDecrease",
            args: [stakingProvider],
          },
          {
            interface: application.contract.interface,
            address: application.address,
            method: "remainingAuthorizationDecreaseDelay",
            args: [stakingProvider],
          },
          currentBlockTimestampContractCall,
          {
            interface: application.contract.interface,
            address: application.address,
            method: "authorizationParameters",
          },
        ])
        expect(result).toEqual({
          authorizedStake,
          pendingAuthorizationDecrease,
          remainingAuthorizationDecreaseDelay,
          ...expectedValue,
        })
      }
    )
  })

  test("should trigger the increase authorization transaction", async () => {
    const tx = {} as ContractTransaction
    const spyOnStaking = jest
      .spyOn(staking, "increaseAuthorization")
      .mockResolvedValue(tx)

    const result = await application.increaseAuthorization(
      stakingProvider,
      amount
    )

    expect(spyOnStaking).toHaveBeenCalledWith(
      stakingProvider,
      application.address,
      amount
    )
    expect(result).toEqual(tx)
  })
})
