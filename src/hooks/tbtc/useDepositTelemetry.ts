import { useCallback } from "react"
import { useCaptureMessage } from "../sentry"
import { verifyDepositAddress } from "../../utils/verifyDepositAddress"
import { BitcoinNetwork } from "../../threshold-ts/types"
import { DepositReceipt } from "tbtc-sdk-v2"

export const useDepositTelemetry = (network: BitcoinNetwork) => {
  const captureMessage = useCaptureMessage()

  return useCallback(
    async (deposit: DepositReceipt, depositAddress: string) => {
      const { status, response } = await verifyDepositAddress(
        deposit,
        depositAddress,
        network
      )

      captureMessage(
        `Generated deposit [${depositAddress}]`,
        {
          ...deposit,
          verificationStatus: status,
          verificationResponse: response,
        },
        {
          "verification.status": status,
        }
      )
    },
    [verifyDepositAddress, network, captureMessage]
  )
}
