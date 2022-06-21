import { useCallback } from "react"
import { BigNumber, BigNumberish, Event, providers, constants } from "ethers"
import {
  PRE_DEPLOYMENT_BLOCK,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  usePREContract,
  useTStakingContract,
} from "../web3/hooks"
import { getAddress, getContractPastEvents } from "../web3/utils"
import { BonusEligibility } from "../types/staking"
import { calculateStakingBonusReward } from "../utils/stakingBonus"
import { stakingBonus } from "../constants"

interface BonusEligibilityResult {
  [address: string]: BonusEligibility
}

export const useCheckBonusEligibility = (): ((
  stakingProviders: string[]
) => Promise<BonusEligibilityResult>) => {
  const preContract = usePREContract()
  const tStakingContract = useTStakingContract()

  return useCallback(
    async (stakingProviders) => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        !preContract ||
        !tStakingContract
      ) {
        return {}
      }
      const provider = preContract.provider

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

      const stakingProviderToPREConfig = await getStakingProviderToPREConfig(
        operatorConfirmedEvents,
        provider
      )

      const stakingProviderToStakedAmount =
        await getStakingProviderToStakedInfo(stakedEvents, provider)

      const stakingProviderToTopUps = await getStakingProviderToTopUps(
        toppedUpEvents,
        provider
      )

      const stakingProviderToUnstakedEvent = await getStakingProviderToUnstake(
        unstakedEvents,
        provider
      )

      const stakingProvidersInfo: BonusEligibilityResult = {}
      for (const stakingProvider of stakingProviders) {
        const stakingProviderAddress = getAddress(stakingProvider)

        const hasPREConfigured =
          stakingProviderToPREConfig[stakingProviderAddress]
            ?.operatorConfirmedAt <= stakingBonus.BONUS_DEADLINE_TIMESTAMP

        const hasActiveStake =
          stakingProviderToStakedAmount[stakingProviderAddress]?.stakedAt <=
          stakingBonus.BONUS_DEADLINE_TIMESTAMP

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
        }
      }

      return stakingProvidersInfo
    },
    [preContract, tStakingContract]
  )
}

interface StakingProviderToStakedInfo {
  [address: string]: {
    amount: BigNumberish
    stakedAt: number
    stakedAtBlock: number
    transactionHash: string
  }
}

const getStakingProviderToStakedInfo = async (
  events: Event[],
  provider: providers.Provider
): Promise<StakingProviderToStakedInfo> => {
  const stakingProviderToStakedAmount: StakingProviderToStakedInfo = {}

  for (const stakedEvent of events) {
    const stakingProvider = getAddress(stakedEvent.args?.stakingProvider)
    const block = await provider.getBlock(stakedEvent.blockHash)

    stakingProviderToStakedAmount[stakingProvider] = {
      amount: stakedEvent.args?.amount as BigNumberish,
      stakedAt: block.timestamp,
      stakedAtBlock: block.number,
      transactionHash: stakedEvent.transactionHash,
    }
  }
  return stakingProviderToStakedAmount
}

interface StakingProviderToPREConfig {
  [address: string]: {
    operator: string
    operatorConfirmedAt: number
    operatorConfirmedAtBlock: number
    transactionHash: string
  }
}

const getStakingProviderToPREConfig = async (
  events: Event[],
  provider: providers.Provider
): Promise<StakingProviderToPREConfig> => {
  const stakingProviderToPREConfig: StakingProviderToPREConfig = {}
  for (const event of events) {
    const stakingProvider = getAddress(event.args?.stakingProvider)
    const block = await provider.getBlock(event.blockHash)

    stakingProviderToPREConfig[stakingProvider] = {
      operator: event.args?.operator,
      operatorConfirmedAt: block.timestamp,
      operatorConfirmedAtBlock: block.number,
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

const getStakingProviderToTopUps = async (
  events: Event[],
  provider: providers.Provider
): Promise<StakingProviderToTopUps> => {
  const stakingProviderToAmount: StakingProviderToTopUps = {}
  for (const event of events) {
    const stakingProvider = getAddress(event.args?.stakingProvider)
    const block = await provider.getBlock(event.blockHash)
    const accummulatedAmount =
      stakingProviderToAmount[stakingProvider]?.amount || constants.Zero

    if (block.timestamp > stakingBonus.BONUS_DEADLINE_TIMESTAMP) {
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
const getStakingProviderToUnstake = async (
  events: Event[],
  provider: providers.Provider
): Promise<StakingProviderToUnstake> => {
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
    const block = await provider.getBlock(event.blockHash)
    const accummulatedAmount =
      stakingProviderToUnstake[stakingProvider]?.amount || constants.Zero
    const newAmount = BigNumber.from(accummulatedAmount).add(event.args?.amount)
    if (block.timestamp > stakingBonus.BONUS_DEADLINE_TIMESTAMP) {
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
