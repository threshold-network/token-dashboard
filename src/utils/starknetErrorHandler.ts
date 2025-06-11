/**
 * StarkNet deposit error handler
 * Provides user-friendly error messages and appropriate severity levels
 */

export interface ErrorHandlerResult {
  shouldShowError: boolean
  userMessage: string
  severity: "error" | "warning" | "info"
}

/**
 * Extracts deposit ID from error message if available
 * @param {string} errorMessage - The error message to extract deposit ID from
 * @return {string | null} The extracted deposit ID or null if not found
 */
function extractDepositId(errorMessage: string): string | null {
  // Try to extract deposit ID from various message formats
  const patterns = [
    /deposit\s+ID:\s*([a-fA-F0-9]+)/i,
    /deposit\s+([a-fA-F0-9]{64})/i,
    /id:\s*([a-fA-F0-9]+)/i,
  ]

  for (const pattern of patterns) {
    const match = errorMessage.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

/**
 * Handles StarkNet deposit errors and returns appropriate user messages
 * @param {any} error - The error object from the deposit operation
 * @return {ErrorHandlerResult} Object containing error handling information
 */
export function handleStarkNetDepositError(error: any): ErrorHandlerResult {
  // Handle null or undefined errors
  if (!error) {
    return {
      shouldShowError: true,
      userMessage: "An unknown error occurred. Please try again.",
      severity: "error",
    }
  }

  // Extract error information
  const statusCode = error.status || error.statusCode || error.response?.status
  const errorMessage = error.message || error.toString()
  const errorData = error.data || error.response?.data

  // Handle 409 Conflict - Deposit already exists
  if (statusCode === 409) {
    const depositId =
      extractDepositId(errorMessage) ||
      extractDepositId(JSON.stringify(errorData))

    if (depositId) {
      return {
        shouldShowError: true,
        userMessage: `This deposit has already been processed (ID: ${depositId.substring(
          0,
          8
        )}...). Your funds are safe and the transaction is complete.`,
        severity: "info",
      }
    }

    return {
      shouldShowError: true,
      userMessage:
        "This deposit has already been processed. Your funds are safe and the transaction is complete.",
      severity: "info",
    }
  }

  // Handle timeout errors
  if (
    errorMessage.toLowerCase().includes("timeout") ||
    errorMessage.toLowerCase().includes("timed out") ||
    error.code === "ETIMEDOUT" ||
    error.code === "ESOCKETTIMEDOUT"
  ) {
    return {
      shouldShowError: true,
      userMessage:
        "The request timed out. This is usually temporary - please wait a moment and try again.",
      severity: "warning",
    }
  }

  // Handle network errors
  if (
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("connection") ||
    error.code === "ECONNREFUSED" ||
    error.code === "ENOTFOUND" ||
    error.code === "ECONNRESET" ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504
  ) {
    return {
      shouldShowError: true,
      userMessage:
        "Network connection issue detected. Please check your internet connection and try again.",
      severity: "warning",
    }
  }

  // Handle rate limiting
  if (statusCode === 429) {
    return {
      shouldShowError: true,
      userMessage:
        "Too many requests. Please wait a few moments before trying again.",
      severity: "warning",
    }
  }

  // Handle validation errors
  if (statusCode === 400) {
    return {
      shouldShowError: true,
      userMessage:
        "Invalid deposit data. Please check your input and try again.",
      severity: "error",
    }
  }

  // Handle unauthorized errors
  if (statusCode === 401 || statusCode === 403) {
    return {
      shouldShowError: true,
      userMessage:
        "Authorization failed. Please reconnect your wallet and try again.",
      severity: "error",
    }
  }

  // Handle server errors
  if (statusCode >= 500) {
    return {
      shouldShowError: true,
      userMessage:
        "Server error occurred. Please try again later or contact support if the issue persists.",
      severity: "error",
    }
  }

  // Handle StarkNet-specific errors
  if (errorMessage.toLowerCase().includes("starknet")) {
    // Check for common StarkNet errors
    if (errorMessage.toLowerCase().includes("insufficient")) {
      return {
        shouldShowError: true,
        userMessage:
          "Insufficient funds or gas. Please check your balance and try again.",
        severity: "error",
      }
    }

    if (errorMessage.toLowerCase().includes("nonce")) {
      return {
        shouldShowError: true,
        userMessage:
          "Transaction nonce issue. Please refresh the page and try again.",
        severity: "warning",
      }
    }
  }

  // Default error handling
  return {
    shouldShowError: true,
    userMessage:
      errorMessage || "An unexpected error occurred. Please try again.",
    severity: "error",
  }
}

/**
 * Determines if an error is retryable
 * @param {any} error - The error object
 * @return {boolean} boolean indicating if the operation can be retried
 */
export function isRetryableError(error: any): boolean {
  const result = handleStarkNetDepositError(error)

  // Retryable errors are typically warnings or specific error types
  if (result.severity === "warning") {
    return true
  }

  // 409 conflicts are not retryable as the deposit already exists
  const statusCode = error.status || error.statusCode || error.response?.status
  if (statusCode === 409) {
    return false
  }

  // Network and timeout errors are retryable
  const errorMessage = error.message || error.toString()
  return (
    errorMessage.toLowerCase().includes("timeout") ||
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("connection")
  )
}
