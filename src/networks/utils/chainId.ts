import { ethers } from "ethers"

export const toHex = (value: string | number): string =>
  ethers.utils.hexValue(ethers.BigNumber.from(value))

export const hexToNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return value
  }
  if (typeof value === "string" && value.startsWith("0x")) {
    // Handle StarkNet chain IDs specially before trying to convert
    const hexString = value.toLowerCase()
    if (hexString === "0x534e5f4d41494e") {
      // StarkNet mainnet - use the numeric value from the enum
      return 0x534e5f4d41494e
    }
    if (hexString === "0x534e5f5345504f4c4941") {
      // StarkNet sepolia - use the numeric value from the enum
      return 0x534e5f5345504f4c4941
    }

    // For other values, use standard conversion
    const bigNumber = ethers.BigNumber.from(value)
    // Check if the value is within safe integer range
    const maxSafeInt = ethers.BigNumber.from(Number.MAX_SAFE_INTEGER.toString())
    if (bigNumber.gt(maxSafeInt)) {
      // For other large chain IDs, try to convert safely
      return bigNumber.mod(maxSafeInt).toNumber()
    }
    return bigNumber.toNumber()
  }

  return parseInt(value)
}

export const isSameChainId = (
  chainId1: string | number,
  chainId2: string | number
): boolean => toHex(chainId1) === toHex(chainId2)

// Enhanced chain ID comparison that handles StarkNet's large hex values
export const compareChainIds = (
  chainId1: string | number,
  chainId2: string | number
): boolean => {
  // If either is a string hex, compare as hex strings
  if (typeof chainId1 === "string" || typeof chainId2 === "string") {
    return toHex(chainId1).toLowerCase() === toHex(chainId2).toLowerCase()
  }
  // Otherwise compare as numbers
  return chainId1 === chainId2
}
