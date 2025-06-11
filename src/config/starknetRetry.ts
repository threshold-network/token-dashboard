/**
 * StarkNet Retry Configuration
 *
 * This file contains recommended retry settings for StarkNet operations.
 * These values should be used when the tbtc-v2.ts SDK is updated to support
 * configurable retry behavior.
 */

export const STARKNET_RETRY_CONFIG = {
  /**
   * Maximum number of retry attempts for reveal requests
   */
  maxRetries: 2, // Down from 3, since first attempt + 2 retries = 3 total attempts

  /**
   * Delay between retry attempts in milliseconds
   * Starting retries after 2 minutes to give relayer ample time
   */
  retryDelays: [
    120000, // 2 minutes after first failure
    180000, // 3 minutes after second failure
  ],

  /**
   * Request timeout in milliseconds
   * Increased from 30 seconds to 2 minutes to handle slow relayer responses
   */
  requestTimeout: 120000, // 2 minutes

  /**
   * HTTP status codes that should NOT trigger a retry
   */
  nonRetryableStatusCodes: [
    400, // Bad Request - invalid data
    401, // Unauthorized - auth issue
    403, // Forbidden - permission issue
    409, // Conflict - deposit already exists
    422, // Unprocessable Entity - validation error
  ],

  /**
   * HTTP status codes that SHOULD trigger a retry
   */
  retryableStatusCodes: [
    408, // Request Timeout
    429, // Too Many Requests (rate limited)
    500, // Internal Server Error
    502, // Bad Gateway
    503, // Service Unavailable
    504, // Gateway Timeout
  ],

  /**
   * Network error codes that should trigger a retry
   */
  retryableNetworkErrors: [
    "ECONNABORTED", // Connection aborted
    "ECONNREFUSED", // Connection refused
    "ENOTFOUND", // DNS lookup failed
    "ETIMEDOUT", // Connection timed out
    "ECONNRESET", // Connection reset
  ],
}

/**
 * Determines if an error should trigger a retry based on our configuration
 * @param {any} error - The error object to check
 * @return {boolean} True if the error should trigger a retry, false otherwise
 */
export function shouldRetryStarkNetRequest(error: any): boolean {
  // Check if it's a network error
  if (STARKNET_RETRY_CONFIG.retryableNetworkErrors.includes(error.code)) {
    return true
  }

  // Check HTTP status codes
  const status = error.response?.status
  if (status) {
    // Explicitly non-retryable
    if (STARKNET_RETRY_CONFIG.nonRetryableStatusCodes.includes(status)) {
      return false
    }
    // Explicitly retryable
    if (STARKNET_RETRY_CONFIG.retryableStatusCodes.includes(status)) {
      return true
    }
  }

  // Default: don't retry unknown errors
  return false
}
