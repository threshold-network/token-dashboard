import { useWeb3React } from "@web3-react/core"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { walletConnected } from "../store/account"
import { PosthogEvent } from "../types/posthog"
import { getWalletTypeFromConnector } from "../web3/utils/connectors"
import { useCapture } from "./posthog"

export const useSaveConnectedAddressToStore = () => {
  const { account, connector } = useWeb3React()
  const dispatch = useDispatch()
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)

  useEffect(() => {
    const address = account ? account : ""
    dispatch(walletConnected(address))

    // Capture posthog wallet connected event
    if (account && connector) {
      const walletType = getWalletTypeFromConnector(connector)
      const posthogData = {
        walletType,
        account,
      }
      // captureWalletConnected(posthogData)
    }
  }, [account, connector])
}
