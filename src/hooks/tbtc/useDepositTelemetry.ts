import axios from "axios"
import { DepositReceipt } from "@keep-network/tbtc-v2.ts"
import { useCallback } from "react"
import { BitcoinNetwork } from "../../threshold-ts/types"
import { verifyDepositAddress } from "../../utils/verifyDepositAddress"
import { useCaptureMessage } from "../sentry"
import { ApiUrl, endpointUrl } from "../../enums"

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
      } catch (error) {
        console.error("Failed to submit deposit telemetry:", error)
        throw new Error("Failed to submit deposit telemetry", { cause: error })
      }
    },
    [verifyDepositAddress, network, captureMessage]
  )
}
