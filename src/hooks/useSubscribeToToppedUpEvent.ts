import { useDispatch } from "react-redux"
import { Event, Contract } from "@ethersproject/contracts"
import { toppedUp } from "../store/staking"
import { useSubscribeToContractEvent, useTStakingContract } from "../web3/hooks"
import { TopUpType } from "../enums"

const getTopUpTypeBasedOnTheEvent = async (
  tStakingContract: Contract,
  stakingProvider: string,
  amount: string,
  event: Event
) => {
  const topUpTTxData = tStakingContract?.interface.encodeFunctionData("topUp", [
    stakingProvider,
    amount,
  ])
  const topUpKEEPTxData = tStakingContract?.interface.encodeFunctionData(
    "topUpKeep",
    [stakingProvider]
  )
  const topUpNUTxData = tStakingContract?.interface.encodeFunctionData(
    "topUpNu",
    [stakingProvider]
  )

  const txResponse = await event.getTransaction()
  const txData = txResponse.data

  switch (txData) {
    case topUpTTxData:
      return TopUpType.NATIVE
    case topUpKEEPTxData:
      return TopUpType.LEGACY_KEEP
    case topUpNUTxData:
      return TopUpType.LEGACY_NU
    default:
      return TopUpType.NATIVE
  }
}

export const useSubscribeToToppedUpEvent = () => {
  const tStakingContract = useTStakingContract()
  const dispatch = useDispatch()

  useSubscribeToContractEvent(
    tStakingContract!,
    "ToppedUp",
    // TODO: figure out how to type callback.
    // @ts-ignore
    async (stakingProvider, amount, event: Event) => {
      const topUpType = await getTopUpTypeBasedOnTheEvent(
        tStakingContract!,
        stakingProvider,
        amount,
        event
      )
      dispatch(
        toppedUp({
          stakingProvider,
          amount,
          topUpType,
        })
      )
    }
  )
}
