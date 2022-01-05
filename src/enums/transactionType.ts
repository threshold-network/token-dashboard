export enum TransactionType {
  ApproveKeep = "APPROVE_KEEP",
  ApproveNu = "APPROVE_NU",
  UpgradeKeep = "UPGRADE_KEEP",
  UpgradeNu = "UPGRADE_NU",
  ApproveT = "APPROVE_T",
}

export enum TransactionStatus {
  Idle = "IDLE",
  PendingWallet = "PENDING_WALLET",
  PendingOnChain = "PENDING_ON_CHAIN",
  Rejected = "REJECTED",
  Failed = "FAILED",
  Succeeded = "SUCCEEDED",
}
