import { ethers } from "ethers"

export const toHex = (value: string | number): string =>
  ethers.utils.hexlify(value)

export const isSameChainId = (
  chainId1: string | number,
  chainId2: string | number
): boolean => {
  const chainId1Hex = toHex(chainId1)
  const chainId2Hex = toHex(chainId2)

  return chainId1Hex.toLowerCase() === chainId2Hex.toLowerCase()
}
