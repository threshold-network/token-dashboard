import { useCallback } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { useTStakingContract, useMulticallContract } from "../web3/hooks"
import {
  getMulticallContractCall,
  getContractPastEvents,
  decodeMulticallResult,
} from "../web3/utils"
import { StakeType } from "../enums"
import { StakeData } from "../types/staking"
import { setStakes } from "../store/staking"
import { useDispatch } from "react-redux"

export const useFetchOwnerStakes = () => {
  const tStakingContract = useTStakingContract()

  const multicallContract = useMulticallContract()

  const dispatch = useDispatch()

  return useCallback(
    async (address: string): Promise<StakeData[]> => {
      if (!tStakingContract || !multicallContract) {
        return []
      }

      const stakedEvents = await getContractPastEvents(tStakingContract, {
        eventName: "Staked",
        fromBlock: 0, // TODO: get contract deployment block.
        filterParams: [undefined, address],
      })

      const stakes = stakedEvents.map((_) => {
        const amount = _.args?.amount.toString()
        const stakeType = _.args?.stakeType as StakeType
        return {
          stakeType,
          owner: _.args?.owner as string,
          stakingProvider: _.args?.stakingProvider as string,
          beneficiary: _.args?.beneficiary as string,
          authorizer: _.args?.authorizer as string,
          blockNumber: _.blockNumber,
          blockHash: _.blockHash,
          transactionHash: _.transactionHash,
          nuInTStake: stakeType === StakeType.NU ? amount : "0",
          keepInTStake: stakeType === StakeType.KEEP ? amount : "0",
          tStake: stakeType === StakeType.T ? amount : "0",
        } as StakeData
      })

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
        }
      })

      dispatch(setStakes(stakes))

      return stakes
    },
    [tStakingContract, multicallContract, dispatch]
  )
}
