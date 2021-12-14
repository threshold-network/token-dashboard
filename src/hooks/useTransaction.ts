import { useSelector, useDispatch } from "react-redux"
import { setTransactionStatus as setTransactionStatusAction } from "../store/transactions"
import { RootState } from "../store"
import { UseTransaction } from "../types/transaction"
import { TransactionStatus, TransactionType } from "../enums/transactionType"

export const useTransaction: UseTransaction = () => {
  const keepApproval = useSelector(
    (state: RootState) => state.transaction[TransactionType.ApproveKeep]
  )
  const nuApproval = useSelector(
    (state: RootState) => state.transaction[TransactionType.ApproveNu]
  )
  const keepUpgrade = useSelector(
    (state: RootState) => state.transaction[TransactionType.UpgradeKeep]
  )
  const nuUpgrade = useSelector(
    (state: RootState) => state.transaction[TransactionType.UpgradeNu]
  )

  const dispatch = useDispatch()

  const setTransactionStatus = (
    type: TransactionType,
    status: TransactionStatus
  ) => dispatch(setTransactionStatusAction({ type, status }))

  return {
    setTransactionStatus,
    keepApproval,
    nuApproval,
    keepUpgrade,
    nuUpgrade,
  }
}
