import { useCallback } from "react"
import { BigNumber, BigNumberish, Event, providers, constants } from "ethers"
import {
  PRE_DEPLOYMENT_BLOCK,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  usePREContract,
  useTStakingContract,
} from "../web3/hooks"
import { getAddress, getContractPastEvents } from "../web3/utils"

interface BonusEligibility {
  [address: string]: {
    hasPREConfigured: boolean
    hasActiveStake: boolean
    // No unstaking after the May 15th "snapshot" and until July 15th (not even
    // partial amounts).
    hasUnstakeAfterBonusDeadline: boolean
    // Only total staked amount before May 15th(May 15 2022 23:59:59) is taking
    // into account.
    eligableStakeAmount: string
  }
}

const BONUS_DEADLINE_TIMESTAMP = 1652659199 // May 15 2022 23:59:59 GMT

export const useCheckBonusEligibility = (): ((
  stakingProviders: string[]
) => Promise<BonusEligibility>) => {
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

      const stakingProviderToPREConfig = await getStakingProviderToPREConfig(
        operatorConfirmedEvents,
        provider
      )
      const stakedEvents = await getContractPastEvents(preContract, {
        eventName: "Staked",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [null, null, stakingProviders],
      })

      const toppedUpEvents = await getContractPastEvents(preContract, {
        eventName: "ToppedUp",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })

      const unstakedEvents = await getContractPastEvents(preContract, {
        eventName: "Unstaked",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })

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

      const stakingProvidersInfo: BonusEligibility = {}
      for (const stakingProvider of stakingProviders) {
        const stakingProviderAddress = getAddress(stakingProvider)

        const hasPREConfigured =
          stakingProviderToPREConfig[stakingProviderAddress]
            ?.operatorConfirmedAt <= BONUS_DEADLINE_TIMESTAMP

        const hasActiveStake =
          stakingProviderToStakedAmount[stakingProviderAddress]?.stakedAt <=
          BONUS_DEADLINE_TIMESTAMP

        const hasUnstakeAfterBonusDeadline =
          stakingProviderToUnstakedEvent[stakingProviderAddress]
            ?.hasUnstakeAfterBonusDeadline

        const stakedAmount =
          stakingProviderToStakedAmount[stakingProviderAddress]?.amount || "0"
        const topUpAmount =
          stakingProviderToTopUps[stakingProviderAddress]?.amount || "0"
        const unstakeAmount =
          stakingProviderToUnstakedEvent[stakingProviderAddress]?.amount || "0"

        const eligableStakeAmount = BigNumber.from(stakedAmount)
          .add(topUpAmount)
          .sub(unstakeAmount)
          .toString()

        stakingProvidersInfo[stakingProviderAddress] = {
          hasPREConfigured,
          hasActiveStake,
          hasUnstakeAfterBonusDeadline,
          eligableStakeAmount: hasUnstakeAfterBonusDeadline
            ? "0"
            : eligableStakeAmount,
        }
      }

      return {}
    },
    [preContract]
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
      stakingProviderToAmount[stakingProvider].amount || constants.Zero

    if (block.timestamp > BONUS_DEADLINE_TIMESTAMP) {
      // Break the loop if an event emitted after May 15th. Returned
      // events are in ascending order.
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
      // If at least one "Unstaked" event occurred after May 15, this provider
      // is not eligible for bonus so we can skip it from further calculations.
      continue
    }
    const block = await provider.getBlock(event.blockHash)
    const accummulatedAmount =
      stakingProviderToUnstake[stakingProvider]?.amount || constants.Zero
    const newAmount = BigNumber.from(accummulatedAmount).add(event.args?.amount)
    if (block.timestamp > BONUS_DEADLINE_TIMESTAMP) {
      // Break the loop if an event emitted after May 15th. Returned
      // events are in ascending order.
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
