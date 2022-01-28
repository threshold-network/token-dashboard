import { useDispatch } from "react-redux"
import { updateStakeAmountForProvider } from "../store/staking"
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
        updateStakeAmountForProvider({
          stakingProvider,
          amount,
          increaseOrDecrease: "decrease",
        })
      )
    }
  )
}
