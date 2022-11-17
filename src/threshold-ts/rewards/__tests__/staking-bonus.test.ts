import { BigNumber } from "ethers"
import { IPRE } from "../../applications/pre"
import { IStaking } from "../../staking"
import {
  dateToUnixTimestamp,
  getAddress,
  getContractPastEvents,
  ONE_SEC_IN_MILISECONDS,
  ZERO,
} from "../../utils"
import { MerkleDropContract } from "../merkle-drop-contract"
import { StakingBonusRewards } from "../staking-bonus"
import { stakingBonus as stakingBonusData } from "../__mocks__/data"

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  dateToUnixTimestamp: jest.fn(),
  getAddress: jest.fn(),
  getContractPastEvents: jest.fn(),
}))

describe("Staking bonus test", () => {
  let stakingBonus: StakingBonusRewards
  let merkleDropContract: MerkleDropContract
  let staking: IStaking
  let pre: IPRE

  beforeEach(() => {
    merkleDropContract = {
      address: "0xBB7aD35819C11E37115FADEBb12524669182fB0D",
      deploymentBlock: 123,
      instance: {
        batchClaim: jest.fn(),
      },
    } as unknown as MerkleDropContract
    staking = {
      getStakedEvents: jest.fn(),
      getToppedUpEvents: jest.fn(),
      getUnstakedEvents: jest.fn(),
    } as unknown as IStaking
    pre = { getOperatorConfirmedEvents: jest.fn() } as unknown as IPRE
    stakingBonus = new StakingBonusRewards(merkleDropContract, staking, pre)
  })

  test("should create an instance correctly", () => {
    expect(stakingBonus.calculateRewards).toBeDefined()
  })

  test.each`
    amount   | expectedResult
    ${"300"} | ${"9"}
    ${"350"} | ${"10"}
  `(
    "should calculate the staking bonus amount correctly for $amount amount",
    ({ amount, expectedResult }) => {
      const result = StakingBonusRewards.calculateStakingBonusReward(amount)

      expect(result.includes(".")).toBeFalsy()
      expect(result).toEqual(expectedResult)
    }
  )

  test("should check if the date is before or equal bonus deadline", () => {
    const mock1 = { timestamp: 1, date: new Date(1 * ONE_SEC_IN_MILISECONDS) }
    const mock2 = {
      timestamp: StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP,
      date: new Date(
        StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP * ONE_SEC_IN_MILISECONDS
      ),
    }
    const mock3 = {
      timestamp: StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP + 1,
      date: new Date(
        (StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP + 1) *
          ONE_SEC_IN_MILISECONDS
      ),
    }

    ;(dateToUnixTimestamp as jest.Mock)
      .mockReturnValueOnce(mock1.timestamp)
      .mockReturnValueOnce(mock2.timestamp)
      .mockReturnValueOnce(mock3.timestamp)

    const result = StakingBonusRewards.isBeforeOrEqualBonusDeadline(mock1.date)
    const result2 = StakingBonusRewards.isBeforeOrEqualBonusDeadline(mock2.date)
    const result3 = StakingBonusRewards.isBeforeOrEqualBonusDeadline(mock3.date)

    expect(dateToUnixTimestamp).toHaveBeenNthCalledWith(1, mock1.date)
    expect(dateToUnixTimestamp).toHaveBeenNthCalledWith(2, mock2.date)
    expect(dateToUnixTimestamp).toHaveBeenNthCalledWith(3, mock3.date)
    expect(result).toBeTruthy()
    expect(result2).toBeTruthy()
    expect(result3).toBeFalsy()
  })

  test("should check correctly if date is between bonus deadline and bonus distribution date", () => {
    const mock1 = {
      timestamp: StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP + 1,
      date: new Date(
        (StakingBonusRewards.BONUS_DEADLINE_TIMESTAMP + 1) *
          ONE_SEC_IN_MILISECONDS
      ),
    }
    const mock2 = {
      timestamp: StakingBonusRewards.REWARDS_DISTRIBUTION_TIMESTAMP + 1,
      date: new Date(
        (StakingBonusRewards.REWARDS_DISTRIBUTION_TIMESTAMP + 1) *
          ONE_SEC_IN_MILISECONDS
      ),
    }

    ;(dateToUnixTimestamp as jest.Mock)
      .mockReturnValueOnce(mock1.timestamp)
      .mockReturnValueOnce(mock2.timestamp)

    const result =
      StakingBonusRewards.isBetweenBonusDealineAndBonusDistribution(mock1.date)
    const result2 =
      StakingBonusRewards.isBetweenBonusDealineAndBonusDistribution(mock2.date)

    expect(dateToUnixTimestamp).toHaveBeenNthCalledWith(1, mock1.date)
    expect(dateToUnixTimestamp).toHaveBeenNthCalledWith(2, mock2.date)

    expect(result).toBeTruthy()
    expect(result2).toBeFalsy()
  })

  describe("calculating rewards test", () => {
    let result: Awaited<ReturnType<typeof stakingBonus.calculateRewards>>

    beforeEach(async () => {
      ;(getAddress as jest.Mock).mockImplementation((address) => {
        return address
      })
      ;(getContractPastEvents as jest.Mock).mockResolvedValue(
        stakingBonusData.calimedEvents
      )
      ;(pre.getOperatorConfirmedEvents as jest.Mock).mockResolvedValue(
        stakingBonusData.operatorConfirmedEvents
      )
      ;(staking.getStakedEvents as jest.Mock).mockResolvedValue(
        stakingBonusData.stakedEvents
      )
      ;(staking.getToppedUpEvents as jest.Mock).mockResolvedValue(
        stakingBonusData.toppedUpEvents
      )
      ;(staking.getUnstakedEvents as jest.Mock).mockResolvedValue(
        stakingBonusData.unstakedEvents
      )
      result = await stakingBonus.calculateRewards(
        stakingBonusData.stakingProviders
      )
    })

    test("should get the `Claimed` events from merkle drop contract", () => {
      expect(getContractPastEvents).toHaveBeenCalledWith(
        merkleDropContract.instance,
        {
          eventName: "Claimed",
          fromBlock: merkleDropContract.deploymentBlock,
          filterParams: [stakingBonusData.stakingProviders],
        }
      )
    })

    test("should get the `OperatorConfirmed` events from pre service", () => {
      expect(pre.getOperatorConfirmedEvents).toHaveBeenCalledWith(
        stakingBonusData.stakingProviders
      )
    })

    test("should get the `Staked` events from staking service", () => {
      expect(staking.getStakedEvents).toHaveBeenCalledWith(
        stakingBonusData.stakingProviders
      )
    })

    test("should get the `ToppedUp` events from staking service", () => {
      expect(staking.getToppedUpEvents).toHaveBeenCalledWith(
        stakingBonusData.stakingProviders
      )
    })

    test("should get the `Unstaked` events from staking service", () => {
      expect(staking.getUnstakedEvents).toHaveBeenCalledWith(
        stakingBonusData.stakingProviders
      )
    })

    test("should return correct data if the staking provider is eligible for rewards and has not claimed rewards yet", () => {
      const eligibleStakingProvider =
        stakingBonusData.providersData.eligibleStakingProvider
      const data = result[eligibleStakingProvider.address]
      const expectedEligibleAmount = calculateEligibleAmount(
        eligibleStakingProvider
      )

      expect(data).toEqual({
        hasPREConfigured: true,
        hasActiveStake: true,
        hasUnstakeAfterBonusDeadline: false,
        eligibleStakeAmount: expectedEligibleAmount,
        reward: StakingBonusRewards.calculateStakingBonusReward(
          expectedEligibleAmount
        ),
        isRewardClaimed: false,
        isEligible: true,
      })
    })

    test("should return correct data if the staking provider is eligible for staking bonus but has already claimed rewards", () => {
      const eligibleStakingProvider =
        stakingBonusData.providersData.eligibleStakingProviderAndClaimedRewards
      const data = result[eligibleStakingProvider.address]
      const expectedEligibleAmount = calculateEligibleAmount(
        eligibleStakingProvider
      )

      expect(data).toEqual({
        hasPREConfigured: true,
        hasActiveStake: true,
        hasUnstakeAfterBonusDeadline: false,
        eligibleStakeAmount: expectedEligibleAmount,
        reward: StakingBonusRewards.calculateStakingBonusReward(
          expectedEligibleAmount
        ),
        isRewardClaimed: true,
        isEligible: true,
      })
    })

    test("should return correct data if the staking provider has `Unstaked` event after the bonus deadline date", () => {
      const eligibleStakingProvider =
        stakingBonusData.providersData.stakingProviderWithUnstakedEvent
      const data = result[eligibleStakingProvider.address]

      expect(data).toEqual({
        hasPREConfigured: true,
        hasActiveStake: true,
        hasUnstakeAfterBonusDeadline: true,
        eligibleStakeAmount: "0",
        reward: "0",
        isRewardClaimed: false,
        isEligible: false,
      })
    })

    test("should return correct data if the staking provider has `Staked` event after the bonus deadline date", () => {
      const eligibleStakingProvider =
        stakingBonusData.providersData
          .stakinngProviderWithStakedEventAfterDeadline
      const data = result[eligibleStakingProvider.address]

      expect(data).toEqual({
        hasPREConfigured: true,
        hasActiveStake: false,
        hasUnstakeAfterBonusDeadline: false,
        eligibleStakeAmount: "0",
        reward: "0",
        isRewardClaimed: false,
        isEligible: false,
      })
    })

    test("should return correct data if the staking provider has not set the PRE node", () => {
      const eligibleStakingProvider =
        stakingBonusData.providersData.stakingProvidetWithoutPRENode
      const data = result[eligibleStakingProvider.address]
      const expectedEligibleAmount = calculateEligibleAmount(
        eligibleStakingProvider
      )

      expect(data).toEqual({
        hasPREConfigured: false,
        hasActiveStake: true,
        hasUnstakeAfterBonusDeadline: false,
        eligibleStakeAmount: expectedEligibleAmount,
        reward: StakingBonusRewards.calculateStakingBonusReward(
          expectedEligibleAmount
        ),
        isRewardClaimed: false,
        isEligible: false,
      })
    })
  })
})

const calculateEligibleAmount = (
  eligibleStakingProvider: typeof stakingBonusData["providersData"][keyof typeof stakingBonusData["providersData"]]
) =>
  eligibleStakingProvider.stakedEvent.args.amount
    .add(
      eligibleStakingProvider.toppedUpEvents
        .filter(
          (_) =>
            _.blockNumber <= StakingBonusRewards.BONUS_DEADLINE_BLOCK_NUMBER
        )
        .reduce((total, _) => total.add(_.args.amount), ZERO)
    )
    .sub(
      eligibleStakingProvider.unstakedEvents.reduce(
        (total, _) => total.add(_.args.amount),
        ZERO
      )
    )
    .toString()
