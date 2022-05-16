import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import {
  useTStakingContract,
  T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
  useMulticallContract,
  usePREContract,
} from "../web3/hooks"
import {
  getMulticallContractCall,
  getContractPastEvents,
  decodeMulticallResult,
  getAddress,
} from "../web3/utils"
import { StakeType } from "../enums"
import { StakeData, StakingProviderInfoData } from "../types/staking"
import { setStakes } from "../store/staking"
import { useDispatch } from "react-redux"
import { useCheckBonusEligibility } from "./useCheckBonusEligibility"

export const useFetchOwnerStakes = () => {
  const tStakingContract = useTStakingContract()

  const simplePREApplicationContract = usePREContract()

  const multicallContract = useMulticallContract()

  const checkBonusEligibility = useCheckBonusEligibility()

  const dispatch = useDispatch()

  return useCallback(
    async (address?: string): Promise<StakeData[]> => {
      if (
        !tStakingContract ||
        !simplePREApplicationContract ||
        !multicallContract ||
        !address
      ) {
        dispatch(setStakes([]))
        return []
      }

      const stakedEvents = await getContractPastEvents(tStakingContract, {
        eventName: "Staked",
        fromBlock: T_STAKING_CONTRACT_DEPLOYMENT_BLOCK,
        filterParams: [undefined, address],
      })

      const stakingProviders = stakedEvents.map(
        (_) => _.args?.stakingProvider as string
      )

      const stakingProviderEligibilityChecks = await checkBonusEligibility(
        stakingProviders
      )

      const stakes = stakedEvents.map((_) => {
        const amount = _.args?.amount.toString()
        const stakeType = _.args?.stakeType as StakeType
        const stakingProvider = getAddress(_.args?.stakingProvider as string)

        return {
          stakeType,
          owner: _.args?.owner as string,
          stakingProvider,
          beneficiary: _.args?.beneficiary as string,
          authorizer: _.args?.authorizer as string,
          blockNumber: _.blockNumber,
          blockHash: _.blockHash,
          transactionHash: _.transactionHash,
          nuInTStake: stakeType === StakeType.NU ? amount : "0",
          keepInTStake: stakeType === StakeType.KEEP ? amount : "0",
          tStake: stakeType === StakeType.T ? amount : "0",
          bonusEligibility: stakingProviderEligibilityChecks[stakingProvider],
        } as StakeData
      })

      const stakingProviderInfoMulticalls = stakes.map((_) => {
        return {
          contract: simplePREApplicationContract,
          method: "stakingProviderInfo",
          args: [_.stakingProvider],
        }
      })

      const stakingProviderInfoMulticallRequests =
        stakingProviderInfoMulticalls.map(getMulticallContractCall)

      const [, stakingProviderInfoResults] = await multicallContract?.aggregate(
        stakingProviderInfoMulticallRequests
      )

      const stakingProviderInfoData = decodeMulticallResult(
        stakingProviderInfoResults,
        stakingProviderInfoMulticalls
      ).reduce(
        (
          finalData: StakingProviderInfoData,
          _,
          idx
        ): StakingProviderInfoData => {
          finalData[stakes[idx].stakingProvider] = {
            operator: _.operator,
            operatorConfirmed: _.operatorConfirmed,
            operatorStartTimestamp: _.operatorStartTimestamp.toString(),
          }
          return finalData
        },
        {}
      )

      const multicalls = stakes.map((_) => ({
        contract: tStakingContract,
        method: "stakes",
        args: [_.stakingProvider],
      }))
      const multiCallsRequests = multicalls.map(getMulticallContractCall)

      const [, result] = await multicallContract?.aggregate(multiCallsRequests)
      const data = decodeMulticallResult(result, multicalls)

      data.forEach((_, index) => {
        const total = BigNumber.from(_.tStake)
          .add(BigNumber.from(_.keepInTStake))
          .add(BigNumber.from(_.nuInTStake))

        stakes[index] = {
          ...stakes[index],
          tStake: _.tStake.toString(),
          keepInTStake: _.keepInTStake.toString(),
          nuInTStake: _.nuInTStake.toString(),
          totalInTStake: total.toString(),
          stakingProviderInfo:
            stakingProviderInfoData[stakes[index].stakingProvider],
        }
      })

      dispatch(setStakes(stakes))

      return stakes
    },
    [tStakingContract, multicallContract, dispatch]
  )
}
