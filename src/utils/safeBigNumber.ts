import { BigNumber, BigNumberish } from "ethers"
import {
  formatUnits as ethersFormatUnits,
  parseUnits as ethersParseUnits,
} from "ethers/lib/utils"

/**
 * Safe wrapper for BigNumber.from() that handles empty strings and invalid values
 * @param {BigNumberish} value The value to convert to BigNumber
 * @param {BigNumberish} defaultValue The default value to use if conversion fails (default: "0")
 * @return {BigNumber} A valid BigNumber
 */
export const safeBigNumber = (
  value: BigNumberish,
  defaultValue: BigNumberish = "0"
): BigNumber => {
  try {
    // Handle null, undefined, or empty string
    if (value === null || value === undefined || value === "") {
      return BigNumber.from(defaultValue)
    }

    // Handle string values
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (
        trimmed === "" ||
        trimmed === "NaN" ||
        trimmed === "undefined" ||
        trimmed === "null"
      ) {
        return BigNumber.from(defaultValue)
      }
    }

    return BigNumber.from(value)
  } catch (error) {
    console.warn("Failed to create BigNumber from value:", value, error)
    return BigNumber.from(defaultValue)
  }
}

/**
 * Safe wrapper for formatUnits that handles empty/invalid values
 * @param {BigNumberish} value The value to format
 * @param {number} decimals The number of decimals (default: 18)
 * @return {string} Formatted string or "0" if invalid
 */
export const safeFormatUnits = (
  value: BigNumberish,
  decimals: number = 18
): string => {
  try {
    const bn = safeBigNumber(value)
    return ethersFormatUnits(bn, decimals)
  } catch (error) {
    console.warn("Failed to format units:", value, error)
    return "0"
  }
}

/**
 * Safe wrapper for parseUnits that handles empty/invalid values
 * @param {string} value The value to parse
 * @param {number} decimals The number of decimals (default: 18)
 * @return {BigNumber} Parsed BigNumber or BigNumber.from("0") if invalid
 */
export const safeParseUnits = (
  value: string,
  decimals: number = 18
): BigNumber => {
  try {
    // Handle null, undefined, or empty string
    if (!value || value.trim() === "") {
      return BigNumber.from("0")
    }

    return ethersParseUnits(value, decimals)
  } catch (error) {
    console.warn("Failed to parse units:", value, error)
    return BigNumber.from("0")
  }
}
