import { useEffect } from "react"
import { Token } from "../../enums"
import { PosthogEvent } from "../../types/posthog"
import { getWalletTypeFromConnector } from "../../web3/utils/connectors"
import { useToken } from "../useToken"
import { useCapture } from "./useCapture"
import { useIsActive } from "../useIsActive"

export const useCaptureWalletConnectedEvent = () => {
  const { account, connector } = useIsActive()
  const { balance, isLoadedFromConnectedAccount } = useToken(Token.TBTCV2)
  const captureWalletConnectedEvent = useCapture(PosthogEvent.WalletConnected)

  useEffect(() => {
    // Capture posthog wallet connected event only if account is connected AND
    // when TBTCV2 token balance is fetched for this account.
    if (account && connector && isLoadedFromConnectedAccount) {
      const walletType = getWalletTypeFromConnector(connector)
      const posthogData = {
        walletType,
        address: account,
        tbtcBalance: balance,
      }
      captureWalletConnectedEvent(posthogData)
    }
  }, [account, connector, balance, isLoadedFromConnectedAccount])
}
