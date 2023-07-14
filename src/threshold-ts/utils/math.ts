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

export function to1ePrecision(n: BigNumberish, precision: number): BigNumber {
  const decimalMultiplier = BigNumber.from(10).pow(precision)
  return BigNumber.from(n).mul(decimalMultiplier)
}

export function to1e18(n: BigNumberish): BigNumber {
  return to1ePrecision(n, 18)
}
