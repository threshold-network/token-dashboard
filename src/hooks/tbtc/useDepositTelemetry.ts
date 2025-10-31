import axios from "axios"
import { DepositReceipt } from "@keep-network/tbtc-v2.ts"
import { useCallback } from "react"
import { BitcoinNetwork } from "../../threshold-ts/types"
import { verifyDepositAddress } from "../../utils/verifyDepositAddress"
import { useCaptureMessage } from "../sentry"
import { ApiUrl, endpointUrl } from "../../enums"
import { isLocalhost } from "../../utils/isLocalhost"

export const useDepositTelemetry = (network: BitcoinNetwork) => {
  const captureMessage = useCaptureMessage()

  return useCallback(
    async (deposit: DepositReceipt, depositAddress: string) => {
      const { status, response } = await verifyDepositAddress(
        deposit,
        depositAddress,
        network
      )

      const {
        depositor,
        blindingFactor,
        walletPublicKeyHash,
        refundPublicKeyHash,
        refundLocktime,
        extraData,
      } = deposit

      captureMessage(
        `Generated deposit [${depositAddress}]`,
        {
          depositor: depositor.identifierHex,
          blindingFactor: blindingFactor.toString(),
          walletPublicKeyHash: walletPublicKeyHash.toString(),
          refundPublicKeyHash: refundPublicKeyHash.toString(),
          refundLocktime: refundLocktime.toString(),
          extraData: extraData?.toString(),
          verificationStatus: status,
          verificationResponse: response,
        },
        {
          "verification.status": status,
        }
      )

      // Skip telemetry submission in localhost to avoid CORS issues
      if (isLocalhost()) {
        console.info(
          "Skipping deposit telemetry submission in localhost environment"
        )
        return
      }

      const requestBody = {
        depositAddress,
        depositor: depositor.identifierHex,
        blindingFactor: blindingFactor.toString(),
        walletPublicKeyHash: walletPublicKeyHash.toString(),
        refundPublicKeyHash: refundPublicKeyHash.toString(),
        refundLocktime: refundLocktime.toString(),
        extraData: extraData?.toString(),
        verificationStatus: status,
        verificationResponse: response,
      }

      try {
        await axios.post(
          `${ApiUrl.TBTC_EXPLORER}${endpointUrl.TBTC_DEPOSIT_DATA}`,
          requestBody,
          { timeout: 10000 }
        )
      } catch (error: any) {
        // Log the error but don't throw it to prevent blocking the deposit flow
        console.warn("Failed to submit deposit telemetry:", error.message)

        // In production, throw only for non-CORS errors
        if (
          !isLocalhost() &&
          (error.response || error.code !== "ERR_NETWORK")
        ) {
          throw new Error("Failed to submit deposit telemetry", {
            cause: error,
          })
        }
      }
    },
    [verifyDepositAddress, network, captureMessage]
  )
}
