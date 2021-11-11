export enum TransactionType {
  ApproveKeep = "APPROVE_KEEP",
  ApproveNu = "APPROVE_NU",
  UpgradeKeep = "UPGRADE_KEEP",
  UpgradeNu = "UPGRADE_NU",
}

export enum TransactionStatus {
  Idle = "IDLE",
  Pending = "PENDING",
  Rejected = "REJECTED",
  Failed = "FAILED",
  Succeeded = "SUCCEEDED",
}
