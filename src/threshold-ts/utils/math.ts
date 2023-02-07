import { BigNumber, BigNumberish } from "ethers"

const compare = (
  a: BigNumberish,
  b: BigNumberish,
  nameOfCompareFunction: "lt" | "gt"
) => {
  const _a = BigNumber.from(a)
  const _b = BigNumber.from(b)

  return _a[nameOfCompareFunction](_b) ? _a : _b
}

export const min = (a: BigNumberish, b: BigNumberish) => {
  return compare(a, b, "lt")
}

export const max = (a: BigNumberish, b: BigNumberish) => {
  return compare(a, b, "gt")
}
