import { ethers } from "ethers"

export const toHex = (value: string | number): string =>
  ethers.utils.hexValue(ethers.BigNumber.from(value))

export const isSameChainId = (
  chainId1: string | number,
  chainId2: string | number
): boolean => toHex(chainId1) === toHex(chainId2)
