import { Token } from "../enums"
import { TransactionStatus, TransactionType } from "../enums/transactionType"

export interface UseTransaction {
  (): {
    setTransactionStatus: (
      type: TransactionType,
      status: TransactionStatus
    ) => TransactionActionTypes
    keepApproval: TransactionInfo
    nuApproval: TransactionInfo
    keepUpgrade: TransactionInfo
    nuUpgrade: TransactionInfo
  }
}

export interface TransactionInfo {
  token: Token
  status: TransactionStatus
}

export interface SetTransactionStatusPayload {
  type: TransactionType
  status: TransactionStatus
}

export interface SetTransactionStatus {
  payload: SetTransactionStatusPayload
}

export type TransactionActionTypes = SetTransactionStatus
