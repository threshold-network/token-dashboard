import { BigNumber, ethers } from "ethers"

export const toHex = (value: string | number): string =>
  ethers.utils.hexValue(ethers.BigNumber.from(value))

export const hexToNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string" && value.startsWith("0x")) {
    return ethers.BigNumber.from(value).toNumber()
  }

  return parseInt(value)
}

export const isSameChainNameOrId = (
  a: string | number | undefined,
  b: string | number | undefined
): boolean => {
  if (a === undefined || b === undefined) return false

  // both numeric → safe BigNumber comparison
  if (!isNaN(+a) && !isNaN(+b)) {
    return BigNumber.from(a).eq(BigNumber.from(b))
  }

  // at least one side is not numeric → do case-insensitive string compare
  return String(a).toLowerCase() === String(b).toLowerCase()
}
