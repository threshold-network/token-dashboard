/**
 * Deposit flow helper utilities
 */
import { BitcoinNetwork } from "../threshold-ts/types"
import { safeToString } from "./sdkDebugger"
import { safeDownloadJSON } from "../web3/utils/files"

/**
 * Generate a safe deposit receipt file
 *
 * @param {Object} params - Parameters for receipt generation
 * @return {boolean} Success indicator
 */
export function generateDepositReceiptFile({
  receipt,
  userWalletAddress,
  btcRecoveryAddress,
  btcDepositAddress,
  ethChainName,
  chainId,
}: {
  receipt: any
  userWalletAddress: string
  btcRecoveryAddress: string
  btcDepositAddress: string
  ethChainName: string
  chainId?: number
}): boolean {
  try {
    // Check for required parameters
    if (!receipt || !userWalletAddress || !btcDepositAddress) {
      console.error("Missing required parameters for deposit receipt")
      return false
    }

    // Use our safe conversion utilities to avoid toString errors
    const depositorIdHexStr =
      receipt.depositor && receipt.depositor.identifierHex
        ? safeToString(receipt.depositor.identifierHex, "")
        : ""
    const refundLocktimeStr = safeToString(receipt.refundLocktime, "")
    const refundPublicKeyHashStr = safeToString(receipt.refundPublicKeyHash, "")
    const blindingFactorStr = safeToString(receipt.blindingFactor, "")
    const walletPublicKeyHashStr = safeToString(receipt.walletPublicKeyHash, "")
    const extraDataStringForDownload = safeToString(receipt.extraData, "")

    // Create filename
    const date = new Date().toISOString().split("T")[0]
    const fileName = `${userWalletAddress}_${btcDepositAddress}_${date}.json`

    // Prepare the data object
    const finalData = {
      depositor: { identifierHex: depositorIdHexStr },
      networkInfo: {
        chainName: ethChainName || "unknown",
        chainId: chainId ? chainId.toString() : "unknown",
      },
      refundLocktime: refundLocktimeStr,
      refundPublicKeyHash: refundPublicKeyHashStr,
      blindingFactor: blindingFactorStr,
      userWalletAddress: userWalletAddress || "",
      walletPublicKeyHash: walletPublicKeyHashStr,
      btcRecoveryAddress: btcRecoveryAddress || "",
      extraData: extraDataStringForDownload,
    }

    // Use our safe download utility
    safeDownloadJSON(finalData, fileName)
    return true
  } catch (error) {
    console.error("[DepositHelper] Failed to generate deposit receipt:", error)
    return false
  }
}

/**
 * Validate a BTC recovery address for the given network
 *
 * @param {string} address - BTC address to validate
 * @param {BitcoinNetwork} network - Bitcoin network (mainnet/testnet)
 * @return {boolean} If address is valid
 */
export function isValidBtcRecoveryAddress(
  address: string,
  network: BitcoinNetwork
): boolean {
  if (!address) return false

  try {
    // Simple length check (basic validation)
    return address.length >= 26 && address.length <= 64
  } catch (error) {
    console.warn("[DepositHelper] Error validating BTC address:", error)
    return false
  }
}
