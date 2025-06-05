import { ethers } from "ethers"

export const toHex = (value: string | number): string => {
  // Handle hex strings that are already in hex format
  if (typeof value === "string" && value.startsWith("0x")) {
    return value.toLowerCase()
  }

  // For numeric values, convert to hex
  if (typeof value === "number") {
    // Check if it's within safe integer range
    if (value <= Number.MAX_SAFE_INTEGER) {
      return ethers.utils.hexValue(value)
    }
    // For large numbers (like StarkNet chain IDs), convert manually
    return "0x" + value.toString(16)
  }

  // For string numbers, convert via BigNumber
  return ethers.utils.hexValue(ethers.BigNumber.from(value))
}

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
  try {
    // If either is a string hex, compare as hex strings
    if (typeof chainId1 === "string" || typeof chainId2 === "string") {
      return toHex(chainId1).toLowerCase() === toHex(chainId2).toLowerCase()
    }
    // Otherwise compare as numbers
    return chainId1 === chainId2
  } catch (error) {
    // Fallback to string comparison if hex conversion fails
    return String(chainId1) === String(chainId2)
  }
}
