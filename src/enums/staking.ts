// Note: Must be in the same order as here:
// https://github.com/threshold-network/solidity-contracts/blob/main/contracts/staking/IStaking.sol#L26-L30
// because solidity eg. for `StakeType.NU` returns 0.
export enum StakeType {
  NU,
  KEEP,
  T,
}

export enum UnstakeType {
  NATIVE,
  LEGACY_KEEP,
  LEGACY_NU,
  ALL,
}

export enum TopUpType {
  NATIVE,
  LEGACY_KEEP,
  LEGACY_NU,
}
