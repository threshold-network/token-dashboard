import { useDispatch } from "react-redux"
import { Event, Contract } from "@ethersproject/contracts"
import { unstaked } from "../store/staking"
import * as rewardsActions from "../store/rewards"
import { useSubscribeToContractEvent, useTStakingContract } from "../web3/hooks"
import { UnstakeType } from "../enums"

const getUnstakeTypeBasedOnTheEvent = async (
  tStakingContract: Contract,
  stakingProvider: string,
  amount: string,
  event: Event
) => {
  const unstakeTTxData = tStakingContract?.interface.encodeFunctionData(
    "unstakeT",
    [stakingProvider, amount]
  )
  const unstakeKEEPTxData = tStakingContract?.interface.encodeFunctionData(
    "unstakeKeep",
    [stakingProvider]
  )
  const unstakeNUTxData = tStakingContract?.interface.encodeFunctionData(
    "unstakeNu",
    [stakingProvider, amount]
  )
  const unstakeAllTxData = tStakingContract?.interface.encodeFunctionData(
    "unstakeAll",
    [stakingProvider]
  )

  const txResponse = await event.getTransaction()
  const txData = txResponse.data

  switch (txData) {
    case unstakeTTxData:
      return UnstakeType.NATIVE
    case unstakeKEEPTxData:
      return UnstakeType.LEGACY_KEEP
    case unstakeNUTxData:
      return UnstakeType.LEGACY_NU
    case unstakeAllTxData:
      return UnstakeType.ALL
    default:
      return UnstakeType.NATIVE
  }
}

export const useSubscribeToUnstakedEvent = () => {
  const tStakingContract = useTStakingContract()
  const dispatch = useDispatch()

  useSubscribeToContractEvent(
    tStakingContract!,
    "Unstaked",
    // TODO: figure out how to type callback.
    // @ts-ignore
    async (stakingProvider, amount, event: Event) => {
      const unstakeType = await getUnstakeTypeBasedOnTheEvent(
        tStakingContract!,
        stakingProvider,
        amount,
        event
      )

      dispatch(
        unstaked({
          stakingProvider,
          amount,
          unstakeType,
        })
      )
      dispatch(rewardsActions.unstaked(stakingProvider))
    }
  )
}
