import { BigNumber, ContractTransaction, providers } from "ethers"
import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { IStaking, Staking } from ".."
import { AddressZero, getContract } from "../../utils"
import { IMulticall } from "../../multicall"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
}))
jest.mock(
  "@threshold-network/solidity-contracts/artifacts/TokenStaking.json",
  () => ({
    address: "0x6A55B762689Ba514569E565E439699aBC731f156",
    abi: [],
  })
)

describe("Staking test", () => {
  let staking: IStaking
  let multicall: IMulticall
  const mockStakingContract = {
    interface: {},
    address: TokenStaking.address,
    authorizedStake: jest.fn(),
    increaseAuthorization: jest.fn(),
  }
  const stakingProvider = "0x486b0ee2eed761f069f327034eb2ae5e07580bf3"
  const application = "0xE775aE21E40d34f01A5C0E1Db9FB3e637D768596"
  const mockedEthereumProvider = {} as providers.Provider
  const ethConfig = {
    providerOrSigner: mockedEthereumProvider,
    chainId: 1,
    account: AddressZero,
  }

  beforeEach(() => {
    ;(getContract as jest.Mock).mockImplementation(() => mockStakingContract)
    multicall = {
      aggregate: jest.fn(),
    }
    staking = new Staking(ethConfig, multicall)
  })

  test("should create the staking instance correctly", () => {
    expect(getContract).toHaveBeenCalledWith(
      TokenStaking.address,
      TokenStaking.abi,
      ethConfig.providerOrSigner,
      ethConfig.account
    )
    expect(staking.stakingContract).toEqual(mockStakingContract)
  })

  test("should return authrozied stake for an application and staking provider", async () => {
    const mockResult = BigNumber.from("100")
    mockStakingContract.authorizedStake.mockResolvedValue(mockResult)

    const result = await staking.authorizedStake(stakingProvider, application)

    expect(mockStakingContract.authorizedStake).toHaveBeenCalledWith(
      stakingProvider,
      application
    )
    expect(result).toEqual(mockResult)
  })

  test("should return authrozied stake for an application and staking provider", async () => {
    const tx = {} as ContractTransaction
    const amount = BigNumber.from("100")

    mockStakingContract.increaseAuthorization.mockResolvedValue(tx)

    const result = await staking.increaseAuthorization(
      stakingProvider,
      application,
      amount
    )

    expect(mockStakingContract.increaseAuthorization).toHaveBeenCalledWith(
      stakingProvider,
      application,
      amount
    )
    expect(result).toEqual(tx)
  })

  test("should return the stake data by staking provider address", async () => {
    const rolesOf = {
      owner: stakingProvider,
      beneficiary: stakingProvider,
      authorizer: stakingProvider,
    }
    const amount = BigNumber.from("100")
    const stakes = { tStake: amount, keepInTStake: amount, nuInTStake: amount }
    const multiCallResult = [rolesOf, stakes]

    const aggregateSpyOn = jest
      .spyOn(multicall, "aggregate")
      .mockResolvedValue(multiCallResult)

    const result = await staking.getStakeByStakingProvider(stakingProvider)

    expect(aggregateSpyOn).toHaveBeenCalledWith([
      {
        interface: mockStakingContract.interface,
        address: mockStakingContract.address,
        method: "rolesOf",
        args: [stakingProvider],
      },
      {
        interface: mockStakingContract.interface,
        address: mockStakingContract.address,
        method: "stakes",
        args: [stakingProvider],
      },
    ])
    expect(result).toEqual({
      ...rolesOf,
      ...stakes,
      stakingProvider,
      totalInTStake: stakes.tStake
        .add(stakes.keepInTStake)
        .add(stakes.nuInTStake),
    })
  })
})
