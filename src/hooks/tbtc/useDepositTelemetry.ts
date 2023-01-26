import { useCallback } from "react"
import { useCaptureMessage } from "../sentry"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"

export const useDepositTelemetry = () => {
  const captureMessage = useCaptureMessage()

  return useCallback(
    (deposit: DepositScriptParameters, depositAddress: string) => {
      captureMessage(`Generated deposit [${depositAddress}]`, deposit)
    },
    []
  )
}
