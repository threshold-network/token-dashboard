import { useDispatch } from "react-redux"
import { unstaked } from "../store/staking"
import { useSubscribeToContractEvent, useTStakingContract } from "../web3/hooks"

export const useSubscribeToUnstakedEvent = () => {
  const tStakingContract = useTStakingContract()
  const dispatch = useDispatch()

  useSubscribeToContractEvent(
    tStakingContract!,
    "Unstaked",
    // TODO: figure out how to type callback.
    // @ts-ignore
    (operator, amount) => {
      console.log("the envet obj ", operator, amount)
      dispatch(unstaked({ operator, amount }))
    }
  )
}
