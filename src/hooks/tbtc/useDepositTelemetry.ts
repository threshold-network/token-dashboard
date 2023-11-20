import { DepositReceipt } from "@keep-network/tbtc-v2.ts"
import { useCallback } from "react"
import { BitcoinNetwork } from "../../threshold-ts/types"
import { verifyDepositAddress } from "../../utils/verifyDepositAddress"
import { useCaptureMessage } from "../sentry"

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
