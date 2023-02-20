import { useCallback } from "react"
import { useCaptureMessage } from "../sentry"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { verifyDepositAddress } from "../../utils/verifyDepositAddress"
import { BitcoinNetwork } from "../../threshold-ts/types"

export const useDepositTelemetry = (network: BitcoinNetwork) => {
  const captureMessage = useCaptureMessage()

  return useCallback(
    async (deposit: DepositScriptParameters, depositAddress: string) => {
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
