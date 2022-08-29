import { ContractInterface, BigNumber, providers } from "ethers"
import { AddressZero, getContract } from "../../utils"
import { Application, IApplication } from ".."
import { IStaking } from "../../staking"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))

describe("Application test", () => {
  let application: IApplication
  let staking: IStaking

  const amount = BigNumber.from("123")
  const time = BigNumber.from("456")
  const address = AddressZero
  const abi: ContractInterface = []
  const stakingProvider = "0x486b0ee2eed761f069f327034eb2ae5e07580bf3"
  const mockedEthereumProvider = {} as providers.Provider
  const mockStakingContract = {
    interface: {},
    address: "0x6A55B762689Ba514569E565E439699aBC731f156",
  }
  const mockAppContract = {
    address,
    minimumAuthorization: jest.fn(),
    pendingAuthorizationDecrease: jest.fn(),
    remainingAuthorizationDecreaseDelay: jest.fn(),
    authorizationParameters: jest.fn(),
    stakingProviderToOperator: jest.fn(),
    isOperatorInPool: jest.fn(),
  }
  const mockMulticall = {
    aggregate: jest.fn(),
  }

  beforeEach(() => {
    staking = {
      authorizedStake: jest.fn(),
      stakingContract: mockStakingContract,
    } as unknown as IStaking
    ;(getContract as jest.Mock).mockImplementation(() => mockAppContract)
    application = new Application(staking, mockMulticall, {
      address,
      abi,
      providerOrSigner: mockedEthereumProvider,
      chainId: "1",
    })
  })

  test("should create the Application instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      address,
      abi,
      mockedEthereumProvider
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

  test("should return the app data for a given staking proivder", async () => {
    const authorizedStake = amount
    const pendingAuthorizationDecrease = time
    const remainingAuthorizationDecreaseDelay = time
    const multicallResult = [
      authorizedStake,
      pendingAuthorizationDecrease,
      remainingAuthorizationDecreaseDelay,
    ]

    const multicallSpy = jest
      .spyOn(mockMulticall, "aggregate")
      .mockResolvedValue(multicallResult)

    const result = await application.getStakingProviderAppInfo(stakingProvider)

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
    ])
    expect(result).toEqual({
      authorizedStake,
      pendingAuthorizationDecrease,
      remainingAuthorizationDecreaseDelay,
    })
  })
})
