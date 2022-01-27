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
    (stakingProvider, amount) => {
      dispatch(
        updateStakeAmountForOperator({
          stakingProvider,
          amount,
          increaseOrDecrease: "decrease",
        })
      )
    }
  )
}
