import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setMinStake } from "../store/staking"
import { useTStakingContract } from "../web3/hooks"
import { useStakingState } from "./useStakingState"

export const useMinStakeAmount = () => {
  const tStakingContract = useTStakingContract()
  const { minStakeAmount } = useStakingState()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchMinStakeAmount = async () => {
      try {
        const minStakeAmount = await tStakingContract?.minTStakeAmount()
        dispatch(setMinStake({ amount: minStakeAmount.toString() }))
      } catch (error) {
        console.error("Could not fetch the min stake amount: ", error)
      }
    }
    if (minStakeAmount === "0") fetchMinStakeAmount()
  }, [tStakingContract, dispatch, minStakeAmount])

  return minStakeAmount
}
