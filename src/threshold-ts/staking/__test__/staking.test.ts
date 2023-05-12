import { BigNumber, ContractTransaction, providers } from "ethers"
import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import NuCypherStakingEscrow from "@threshold-network/solidity-contracts/artifacts/NuCypherStakingEscrow.json"
import KeepTokenStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { IStaking, Stake, StakeType, Staking } from ".."
import {
  AddressZero,
  getContract,
  ZERO,
  getContractAddressFromTruffleArtifact,
  getContractPastEvents,
} from "../../utils"
import { IMulticall } from "../../multicall"
import {
  IVendingMachines,
  IVendingMachine,
  ConversionToT,
} from "../../vending-machine"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
  getContractAddressFromTruffleArtifact: jest.fn(),
  getContractPastEvents: jest.fn(),
}))

jest.mock(
  "@threshold-network/solidity-contracts/artifacts/TokenStaking.json",
  () => ({
    address: "0x6A55B762689Ba514569E565E439699aBC731f156",
    abi: [],
  })
)

jest.mock(
  "@threshold-network/solidity-contracts/artifacts/NuCypherStakingEscrow.json",
  () => ({
    address: "0xd696d5a9b083959587F30e487038529a876b08C2",
    abi: [],
  })
)

jest.mock("@keep-network/keep-core/artifacts/TokenStaking.json", () => ({
  address: "0x73A63e2Be2D911dc7eFAc189Bfdf48FbB6532B5b",
  abi: [],
}))

describe("Staking test", () => {
  let staking: IStaking
  let multicall: IMulticall
  const mockStakingContract = {
    interface: {},
    address: TokenStaking.address,
    authorizedStake: jest.fn(),
    increaseAuthorization: jest.fn(),
  }

  const mockLegacyKeepStaking = {
    interface: {},
    address: TokenStaking.address,
  }
  const mockLegacyNuStaking = {
    interface: {},
    address: TokenStaking.address,
    stakerInfo: jest.fn(),
  }
  const stakingProvider = "0x486b0ee2eed761f069f327034eb2ae5e07580bf3"
  const application = "0xE775aE21E40d34f01A5C0E1Db9FB3e637D768596"
  const mockedEthereumProvider = {} as providers.Provider
  const ethConfig = {
    providerOrSigner: mockedEthereumProvider,
    chainId: 1,
    account: AddressZero,
  }

  const vendingMachines = {
    nu: { convertToT: jest.fn() } as unknown as IVendingMachine,
    keep: { convertToT: jest.fn() } as unknown as IVendingMachine,
  } as IVendingMachines

  const keepTokenStakingAddress = (
    KeepTokenStaking as unknown as { address: string }
  ).address

  beforeEach(() => {
    ;(getContract as jest.Mock)
      .mockImplementationOnce(() => mockStakingContract)
      .mockImplementationOnce(() => mockLegacyKeepStaking)
      .mockImplementationOnce(() => mockLegacyNuStaking)
    ;(getContractAddressFromTruffleArtifact as jest.Mock).mockReturnValue(
      keepTokenStakingAddress
    )
    multicall = {
      aggregate: jest.fn(),
      getCurrentBlockTimestampCallObj: jest.fn(),
    }
    staking = new Staking(ethConfig, multicall, vendingMachines)
  })

  test("should create the staking instance correctly", () => {
    expect(getContract).toHaveBeenNthCalledWith(
      1,
      TokenStaking.address,
      TokenStaking.abi,
      ethConfig.providerOrSigner,
      ethConfig.account
    )
    expect(getContractAddressFromTruffleArtifact).toHaveBeenCalledWith(
      KeepTokenStaking
    )
    expect(getContract).toHaveBeenNthCalledWith(
      2,
      keepTokenStakingAddress,
      KeepTokenStaking.abi,
      ethConfig.providerOrSigner,
      ethConfig.account
    )
    expect(getContract).toHaveBeenNthCalledWith(
      3,
      NuCypherStakingEscrow.address,
      NuCypherStakingEscrow.abi,
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
    // Type of Multicall result is `Result` from `ethers`. A `Result` is an
    // array, so each value can be accessed as a positional argument.
    // Additionally, if values are named, the identical object as its positional
    // value can be accessed by its name. Here we simulate the return value from
    // `Multicall` service.
    const eligibleKeepStake = { balance: amount.add("100") }
    const nuStakerInfo = {
      stakingProvider: stakingProvider,
      value: amount.add(300),
    }
    const keepToTConversion: ConversionToT = {
      tAmount: BigNumber.from("110"),
      wrappedRemainder: ZERO,
    }
    const nuToTConversion: ConversionToT = {
      tAmount: BigNumber.from("120"),
      wrappedRemainder: ZERO,
    }

    const multiCallResult = [rolesOf, stakes, eligibleKeepStake]

    const aggregateSpyOn = jest
      .spyOn(multicall, "aggregate")
      .mockResolvedValue(multiCallResult)

    mockLegacyNuStaking.stakerInfo.mockResolvedValue(nuStakerInfo)
    ;(vendingMachines.keep.convertToT as jest.Mock).mockResolvedValue(
      keepToTConversion
    )
    ;(vendingMachines.nu.convertToT as jest.Mock).mockResolvedValue(
      nuToTConversion
    )

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
      {
        interface: mockLegacyKeepStaking.interface,
        address: mockLegacyKeepStaking.address,
        method: "eligibleStake",
        args: [stakingProvider, mockStakingContract.address],
      },
    ])

    expect(vendingMachines.keep.convertToT).toHaveBeenCalledWith(
      eligibleKeepStake.balance.toString()
    )
    expect(vendingMachines.nu.convertToT).toHaveBeenCalledWith(
      nuStakerInfo.value.toString()
    )

    expect(result).toEqual({
      stakeType: undefined,
      ...rolesOf,
      ...stakes,
      stakingProvider,
      totalInTStake: stakes.tStake
        .add(stakes.keepInTStake)
        .add(stakes.nuInTStake),
      possibleKeepTopUpInT: keepToTConversion.tAmount.sub(stakes.keepInTStake),
      possibleNuTopUpInT: nuToTConversion.tAmount.sub(stakes.nuInTStake),
    })
  })

  test("should return all stakes for a given owner address", async () => {
    const owner = "0x97839202A818D2C927f7f44685c5a34f80FbcdB6"
    const stakingProvider1 = stakingProvider
    const stakingProvider2 = "0xad96829b90c8c2cbbe8e59dd3bf1c101c38cd822"
    const stakingProvider3 = "0xd74Cf2a8b8DFc2CA74Be5f381c4c220238F63c58"

    const mockPastEventsResult = [
      { args: { stakingProvider: stakingProvider1, stakeType: StakeType.T } },
      {
        args: { stakingProvider: stakingProvider2, stakeType: StakeType.KEEP },
      },
      { args: { stakingProvider: stakingProvider3, stakeType: StakeType.NU } },
    ]
    ;(getContractPastEvents as jest.Mock).mockResolvedValue([
      ...mockPastEventsResult,
    ])

    const mockStakes = [
      { ...mockPastEventsResult[2].args, owner },
      { ...mockPastEventsResult[1].args, owner },
      { ...mockPastEventsResult[0].args, owner },
    ] as Stake[]

    const spyOnFindRefreshedKeepStakes = jest
      .spyOn(staking, "findRefreshedKeepStakes")
      .mockResolvedValueOnce({ current: [], outdated: [] })

    const spyOnGetStakeByStakingProvider = jest
      .spyOn(staking, "getStakeByStakingProvider")
      .mockResolvedValueOnce(mockStakes[0])
      .mockResolvedValueOnce(mockStakes[1])
      .mockResolvedValueOnce(mockStakes[2])

    const result = await staking.getOwnerStakes(owner)

    expect(getContractPastEvents).toHaveBeenCalledWith(mockStakingContract, {
      eventName: "Staked",
      fromBlock: staking.STAKING_CONTRACT_DEPLOYMENT_BLOCK,
      filterParams: [undefined, owner],
    })

    expect(spyOnFindRefreshedKeepStakes).toHaveBeenCalledWith(owner)

    mockPastEventsResult.reverse().forEach((event, index) => {
      expect(spyOnGetStakeByStakingProvider).toHaveBeenNthCalledWith(
        index + 1,
        event.args.stakingProvider,
        event.args.stakeType
      )
    })
    expect(result).toEqual(mockStakes)
  })
})
