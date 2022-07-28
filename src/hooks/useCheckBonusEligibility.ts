import { useEffect } from "react"
import { BigNumber, BigNumberish, Event, constants } from "ethers"
import {
  PRE_DEPLOYMENT_BLOCK,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  usePREContract,
  useTStakingContract,
} from "../web3/hooks"
import { getAddress, getContractPastEvents } from "../web3/utils"
import { BonusEligibility } from "../types"
import { calculateStakingBonusReward } from "../utils/stakingBonus"
import { stakingBonus } from "../constants"
import {
  useMerkleDropContract,
  DEPLOYMENT_BLOCK,
} from "../web3/hooks/useMerkleDropContract"
import { selectStakingProviders } from "../store/staking"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store"
import { setStakingBonus } from "../store/rewards"

interface BonusEligibilityResult {
  [address: string]: BonusEligibility
}

export const useCheckBonusEligibility = () => {
  const stakingProviders = useSelector(selectStakingProviders)
  const { hasFetched, isFetching } = useSelector(
    (state: RootState) => state.rewards.stakingBonus
  )
  const dispatch = useDispatch()
  const preContract = usePREContract()
  const merkleDropContract = useMerkleDropContract()
  const tStakingContract = useTStakingContract()

  useEffect(() => {
    const fetch = async () => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        !preContract ||
        !tStakingContract ||
        !merkleDropContract ||
        (hasFetched && !isFetching)
      ) {
        return
      }

      const claimedRewards = new Set(
        (
          await getContractPastEvents(merkleDropContract, {
            eventName: "Claimed",
            fromBlock: DEPLOYMENT_BLOCK,
            filterParams: [stakingProviders],
          })
        ).map((_) => getAddress(_.args?.stakingProvider as string))
      )

      const operatorConfirmedEvents = await getContractPastEvents(preContract, {
        eventName: "OperatorConfirmed",
        fromBlock: PRE_DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })
      const stakedEvents = await getContractPastEvents(tStakingContract, {
        eventName: "Staked",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [null, null, stakingProviders],
      })

      const toppedUpEvents = await getContractPastEvents(tStakingContract, {
        eventName: "ToppedUp",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })

      const unstakedEvents = await getContractPastEvents(tStakingContract, {
        eventName: "Unstaked",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })

      const stakingProviderToPREConfig = getStakingProviderToPREConfig(
        operatorConfirmedEvents
      )

      const stakingProviderToStakedAmount =
        getStakingProviderToStakedInfo(stakedEvents)

      const stakingProviderToTopUps = getStakingProviderToTopUps(toppedUpEvents)

      const stakingProviderToUnstakedEvent =
        getStakingProviderToUnstake(unstakedEvents)

      const stakingProvidersInfo: BonusEligibilityResult = {}
      for (const stakingProvider of stakingProviders) {
        const stakingProviderAddress = getAddress(stakingProvider)

        const hasPREConfigured =
          stakingProviderToPREConfig[stakingProviderAddress]
            ?.operatorConfirmedAtBlock <=
          stakingBonus.BONUS_DEADLINE_BLOCK_NUMBER

        const hasActiveStake =
          stakingProviderToStakedAmount[stakingProviderAddress]
            ?.stakedAtBlock <= stakingBonus.BONUS_DEADLINE_BLOCK_NUMBER

        const hasUnstakeAfterBonusDeadline =
          stakingProviderToUnstakedEvent[stakingProviderAddress]
            ?.hasUnstakeAfterBonusDeadline

        const stakedAmount =
          stakingProviderToStakedAmount[stakingProviderAddress]?.amount || "0"
        const topUpAmount =
          stakingProviderToTopUps[stakingProviderAddress]?.amount || "0"
        const unstakeAmount =
          stakingProviderToUnstakedEvent[stakingProviderAddress]?.amount || "0"

        const eligibleStakeAmount =
          !hasUnstakeAfterBonusDeadline && hasActiveStake
            ? BigNumber.from(stakedAmount)
                .add(topUpAmount)
                .sub(unstakeAmount)
                .toString()
            : "0"

        stakingProvidersInfo[stakingProviderAddress] = {
          hasPREConfigured,
          hasActiveStake,
          hasUnstakeAfterBonusDeadline,
          eligibleStakeAmount,
          reward: calculateStakingBonusReward(eligibleStakeAmount),
          isRewardClaimed: claimedRewards.has(stakingProviderAddress),
          isEligible: Boolean(
            hasActiveStake && !hasUnstakeAfterBonusDeadline && hasPREConfigured
          ),
        }
      }
      dispatch(setStakingBonus(stakingProvidersInfo))
    }
    fetch()
  }, [
    stakingProviders,
    tStakingContract,
    merkleDropContract,
    dispatch,
    hasFetched,
    isFetching,
  ])
}

interface StakingProviderToStakedInfo {
  [address: string]: {
    amount: BigNumberish
    stakedAtBlock: number
    transactionHash: string
  }
}

const getStakingProviderToStakedInfo = (
  events: Event[]
): StakingProviderToStakedInfo => {
  const stakingProviderToStakedAmount: StakingProviderToStakedInfo = {}

  for (const stakedEvent of events) {
    const stakingProvider = getAddress(stakedEvent.args?.stakingProvider)

    stakingProviderToStakedAmount[stakingProvider] = {
      amount: stakedEvent.args?.amount as BigNumberish,
      stakedAtBlock: stakedEvent.blockNumber,
      transactionHash: stakedEvent.transactionHash,
    }
  }
  return stakingProviderToStakedAmount
}

interface StakingProviderToPREConfig {
  [address: string]: {
    operator: string
    operatorConfirmedAtBlock: number
    transactionHash: string
  }
}

const getStakingProviderToPREConfig = (
  events: Event[]
): StakingProviderToPREConfig => {
  const stakingProviderToPREConfig: StakingProviderToPREConfig = {}
  for (const event of events) {
    const stakingProvider = getAddress(event.args?.stakingProvider)

    stakingProviderToPREConfig[stakingProvider] = {
      operator: event.args?.operator,
      operatorConfirmedAtBlock: event.blockNumber,
      transactionHash: event.transactionHash,
    }
  }

  return stakingProviderToPREConfig
}

interface StakingProviderToTopUps {
  [address: string]: {
    amount: BigNumberish
  }
}

const getStakingProviderToTopUps = (
  events: Event[]
): StakingProviderToTopUps => {
  const stakingProviderToAmount: StakingProviderToTopUps = {}
  for (const event of events) {
    const stakingProvider = getAddress(event.args?.stakingProvider)
    const accummulatedAmount =
      stakingProviderToAmount[stakingProvider]?.amount || constants.Zero

    if (event.blockNumber > stakingBonus.BONUS_DEADLINE_BLOCK_NUMBER) {
      // Break the loop if an event is emitted after the bonus deadline.
      // Returned events are in ascending order.
      return stakingProviderToAmount
    }
    stakingProviderToAmount[stakingProvider] = {
      amount: BigNumber.from(accummulatedAmount).add(event.args?.amount),
    }
  }

  return stakingProviderToAmount
}

interface StakingProviderToUnstake {
  [address: string]: {
    amount: BigNumberish
    hasUnstakeAfterBonusDeadline: boolean
  }
}
const getStakingProviderToUnstake = (
  events: Event[]
): StakingProviderToUnstake => {
  const stakingProviderToUnstake: StakingProviderToUnstake = {}
  for (const event of events) {
    const stakingProvider = getAddress(event.args?.stakingProvider)
    const stakingProviderInfo = stakingProviderToUnstake[stakingProvider]
    if (stakingProviderInfo?.hasUnstakeAfterBonusDeadline) {
      // If at least one `Unstaked` event occurred after bonus deadline, this
      // provider is not eligible for bonus so we can skip it from further
      // calculations.
      continue
    }
    const accummulatedAmount =
      stakingProviderToUnstake[stakingProvider]?.amount || constants.Zero
    const newAmount = BigNumber.from(accummulatedAmount).add(event.args?.amount)
    if (event.blockNumber > stakingBonus.BONUS_DEADLINE_BLOCK_NUMBER) {
      stakingProviderToUnstake[stakingProvider] = {
        amount: newAmount,
        hasUnstakeAfterBonusDeadline: true,
      }
    } else {
      stakingProviderToUnstake[stakingProvider] = {
        amount: newAmount,
        hasUnstakeAfterBonusDeadline: false,
      }
    }
  }

  return stakingProviderToUnstake
}
