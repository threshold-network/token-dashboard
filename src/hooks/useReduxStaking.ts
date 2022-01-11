import { useSelector, useDispatch } from "react-redux"
import { updateState as updateStateAction } from "../store/staking"
import { RootState } from "../store"
import { UseReduxStaking } from "../types/staking"

export const useReduxStaking: UseReduxStaking = () => {
  const operator = useSelector((state: RootState) => state.staking.operator)
  const beneficiary = useSelector(
    (state: RootState) => state.staking.beneficiary
  )
  const authorizer = useSelector((state: RootState) => state.staking.authorizer)
  const stakeAmount = useSelector(
    (state: RootState) => state.staking.stakeAmount
  )

  const dispatch = useDispatch()

  const setBeneficiary = (beneficiary: string) =>
    dispatch(updateStateAction({ key: "beneficiary", value: beneficiary }))
  const setAuthorizer = (authorizer: string) =>
    dispatch(updateStateAction({ key: "authorizer", value: authorizer }))
  const setOperator = (operator: string) =>
    dispatch(updateStateAction({ key: "operator", value: operator }))
  const setStakeAmount = (stakeAmount: string | number) =>
    dispatch(updateStateAction({ key: "stakeAmount", value: stakeAmount }))

  return {
    setOperator,
    setAuthorizer,
    setBeneficiary,
    beneficiary,
    authorizer,
    operator,
    stakeAmount,
    setStakeAmount,
  }
}
