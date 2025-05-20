/**
 * SDK Debugging Utilities
 *
 * Provides tools for diagnosing issues with the tBTC SDK integration
 */

// We use any for the SDK type since we don't have direct access to its typing
import { findInMapCaseInsensitive, inspectMapKeys } from "./debugHelpers"

/**
 * Safely converts SDK objects to string with proper error handling
 * Use this for any SDK object that might be null/undefined or have toString issues
 *
 * @param {any} sdkObject - Object to convert to string safely
 * @param {string} defaultValue - Default value to return if conversion fails
 * @return {string} String representation or default value
 */
export function safeToString(
  sdkObject: any,
  defaultValue: string = ""
): string {
  if (!sdkObject) return defaultValue

  try {
    if (typeof sdkObject === "string") return sdkObject

    if (typeof sdkObject.toString === "function") {
      const result = sdkObject.toString()
      return result || defaultValue
    }

    // Fallback for objects without toString
    if (typeof sdkObject === "object") {
      // For objects with _hex property (common in SDK)
      if (sdkObject._hex) {
        if (typeof sdkObject._hex.toString === "function") {
          return sdkObject._hex.toString()
        } else if (sdkObject._hex instanceof Uint8Array) {
          // Convert Uint8Array to hex string
          return Array.from(sdkObject._hex)
            .map((value: unknown) => {
              const byte = value as number
              return byte.toString(16).padStart(2, "0")
            })
            .join("")
        }
      }

      // For objects with identifierHex (addresses)
      if (sdkObject.identifierHex) {
        return sdkObject.identifierHex.toString
          ? sdkObject.identifierHex.toString()
          : String(sdkObject.identifierHex)
      }

      // Last resort: JSON stringify
      try {
        return JSON.stringify(sdkObject)
      } catch (e) {
        // Silent failure
      }
    }

    // Final fallback
    return String(sdkObject) || defaultValue
  } catch (error) {
    return defaultValue
  }
}

/**
 * Diagnose cross-chain contract issues by examining internal SDK state
 *
 * @param {any} sdk - The SDK instance to diagnose
 * @param {string} networkName - The network name being sought
 * @return {object} Diagnosis results
 */
export async function diagnoseCrossChainContracts(
  sdk: any,
  networkName: string
): Promise<{
  hasCrossChainContracts: boolean
  contractsFound: boolean
  foundWithCaseInsensitive: boolean
  existingKeys: string[]
  recommendedKey: string | null
  errorDetails: string | null
}> {
  const result = {
    hasCrossChainContracts: false,
    contractsFound: false,
    foundWithCaseInsensitive: false,
    existingKeys: [] as string[],
    recommendedKey: null as string | null,
    errorDetails: null as string | null,
  }

  try {
    // Check if crossChainContracts exists and is a function
    if (
      !sdk.crossChainContracts ||
      typeof sdk.crossChainContracts !== "function"
    ) {
      result.errorDetails = "SDK does not have crossChainContracts method"
      return result
    }

    result.hasCrossChainContracts = true

    // Try to access the internal map using reflection
    const contractsMap = (sdk as any)["#crossChainContracts"]
    if (!contractsMap || !(contractsMap instanceof Map)) {
      result.errorDetails = "Unable to access internal crossChainContracts map"
      return result
    }

    // Get existing keys
    result.existingKeys = Array.from(contractsMap.keys())

    // Try direct access first
    const contracts = sdk.crossChainContracts(networkName as any)
    result.contractsFound = !!contracts

    if (!result.contractsFound) {
      // Try case-insensitive lookup
      const caseInsensitiveMatch = result.existingKeys.find(
        (key) =>
          typeof key === "string" &&
          typeof networkName === "string" &&
          key.toLowerCase() === networkName.toLowerCase()
      )

      if (caseInsensitiveMatch) {
        result.foundWithCaseInsensitive = true
        result.recommendedKey = caseInsensitiveMatch
      }
    }

    return result
  } catch (error) {
    result.errorDetails = `Error during diagnosis: ${error}`
    return result
  }
}

/**
 * Try to get cross-chain contracts with flexible key matching
 *
 * @param {any} sdk - The SDK instance
 * @param {string} networkName - The network name to look for
 * @return {any} The contracts if found, null otherwise
 */
export function getFlexibleCrossChainContracts(
  sdk: any,
  networkName: string
): any {
  if (
    !sdk ||
    !sdk.crossChainContracts ||
    typeof sdk.crossChainContracts !== "function"
  ) {
    return null
  }

  try {
    // Try direct access first
    const contracts = sdk.crossChainContracts(networkName as any)
    if (contracts) {
      return contracts
    }

    // If direct access fails, try to access internal map
    const contractsMap = (sdk as any)["#crossChainContracts"]
    if (!contractsMap || !(contractsMap instanceof Map)) {
      return null
    }

    // Try case-insensitive lookup
    const foundContracts = findInMapCaseInsensitive(contractsMap, networkName)
    if (foundContracts) {
      return foundContracts
    }

    return null
  } catch (error) {
    return null
  }
}
