import { createSlice } from "@reduxjs/toolkit"
import { TransactionStatus, TransactionType } from "../../enums/transactionType"
import {
  SetTransactionStatusPayload,
  TransactionInfo,
} from "../../types/transaction"
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction"
import { Token } from "../../enums"

export const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    [TransactionType.ApproveKeep]: {
      token: Token.Keep,
      status: TransactionStatus.Idle,
    },
    [TransactionType.ApproveNu]: {
      token: Token.Nu,
      status: TransactionStatus.Idle,
    },
    [TransactionType.ApproveT]: {
      token: Token.T,
      status: TransactionStatus.Idle,
    },
    [TransactionType.UpgradeKeep]: {
      token: Token.Keep,
      status: TransactionStatus.Idle,
    },
    [TransactionType.UpgradeNu]: {
      token: Token.Nu,
      status: TransactionStatus.Idle,
    },
  } as Record<TransactionType, TransactionInfo>,
  reducers: {
    setTransactionStatus: (
      state,
      action: PayloadAction<SetTransactionStatusPayload>
    ) => {
      state[action.payload.type].status = action.payload.status
    },
  },
})

export const { setTransactionStatus } = transactionSlice.actions
