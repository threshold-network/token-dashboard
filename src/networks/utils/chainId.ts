import { ethers } from "ethers"

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

export const isSameChainId = (
  chainId1: string | number,
  chainId2: string | number
): boolean => toHex(chainId1) === toHex(chainId2)
