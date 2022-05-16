import { useCallback } from "react"
import { BigNumber, BigNumberish, Event, providers, constants } from "ethers"
import {
  PRE_DEPLOYMENT_BLOCK,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  useMulticallContract,
  usePREContract,
  useTStakingContract,
} from "../web3/hooks"
import {
  decodeMulticallResult,
  getAddress,
  getContractPastEvents,
  getMulticallContractCall,
} from "../web3/utils"
import { BonusEligibility, StakingProviderInfoData } from "../types/staking"
import { calculateStakingBonusReward } from "../utils/stakingBonus"
import { stakingBonus } from "../constants"

export const useStakingProviderInfo = (): ((
  stakingProviders: string[]
) => Promise<StakingProviderInfoData>) => {
  const preContract = usePREContract()
  const tStakingContract = useTStakingContract()
  const multicallContract = useMulticallContract()

  return useCallback(
    async (stakingProviders) => {
      if (
        !stakingProviders ||
        stakingProviders.length === 0 ||
        !preContract ||
        !tStakingContract
      ) {
        return {} as StakingProviderInfoData
      }

      const stakingProviderInfoMulticalls = stakingProviders.map(
        (stakingProvider) => {
          return {
            contract: preContract,
            method: "stakingProviderInfo",
            args: [stakingProvider],
          }
        }
      )

      const stakingProviderInfoMulticallRequests =
        stakingProviderInfoMulticalls.map(getMulticallContractCall)

      const [, stakingProviderInfoResults] = await multicallContract?.aggregate(
        stakingProviderInfoMulticallRequests
      )

      return decodeMulticallResult(
        stakingProviderInfoResults,
        stakingProviderInfoMulticalls
      ).reduce(
        (
          finalData: StakingProviderInfoData,
          _,
          idx
        ): StakingProviderInfoData => {
          finalData[stakingProviders[idx]] = {
            operator: _.operator,
            operatorConfirmed: _.operatorConfirmed,
            operatorStartTimestamp: _.operatorStartTimestamp.toString(),
          }
          return finalData
        },
        {}
      )
    },
    [preContract, tStakingContract, multicallContract]
  )
}
