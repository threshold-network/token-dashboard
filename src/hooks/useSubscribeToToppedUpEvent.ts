import { useDispatch } from "react-redux"
import { updateStakeAmountForOperator } from "../store/staking"
import { useSubscribeToContractEvent, useTStakingContract } from "../web3/hooks"

export const useSubscribeToToppedUpEvent = () => {
  const tStakingContract = useTStakingContract()
  const dispatch = useDispatch()

  useSubscribeToContractEvent(
    tStakingContract!,
    "ToppedUp",
    // TODO: figure out how to type callback.
    // @ts-ignore
    (stakingProvider, amount) => {
      dispatch(
        updateStakeAmountForOperator({
          stakingProvider,
          amount,
          increaseOrDecrease: "increase",
        })
      )
    }
  )
}
