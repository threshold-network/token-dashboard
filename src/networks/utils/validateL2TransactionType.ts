import { ALLOWED_L2_TRANSACTIONS } from "../constants/networks"
import { AllowedL2TransactionTypes } from "../enums/networks"

export function isValidL2Transaction<T = AllowedL2TransactionTypes>(
  type?: T
): boolean {
  if (!type) return false
  return ALLOWED_L2_TRANSACTIONS.includes(
    type as unknown as AllowedL2TransactionTypes
  )
}
