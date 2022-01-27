import { useDispatch } from "react-redux"
import { updateStakeAmountForOperator } from "../store/staking"
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
      dispatch(
        updateStakeAmountForOperator({
          operator,
          amount,
          increaseOrDecrease: "decrease",
        })
      )
    }
  )
}
