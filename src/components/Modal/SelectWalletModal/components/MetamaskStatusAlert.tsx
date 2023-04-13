import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  MetamaskNotInstalledAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."
import { useCapture } from "../../../../hooks/posthog"
import { PosthogEvent } from "../../../../types/posthog"
import { WalletType } from "../../../../enums"

const MetamaskStatusAlert: FC<{
  metamaskNotInstalled?: boolean
  connectionRejected?: boolean
  isMetaMask: boolean
}> = ({ metamaskNotInstalled, connectionRejected, isMetaMask }) => {
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)
  const { active } = useWeb3React()

  if (metamaskNotInstalled) {
    return <MetamaskNotInstalledAlert />
  }
  if (connectionRejected) {
    return <WalletRejectedAlert />
  }
  if (!isMetaMask) {
    return (
      <>
        window.ethereum is not MetaMask. Make sure you have MetaMask extension
        installed and MetaMask is your default wallet.
      </>
    )
  }
  if (active) {
    captureWalletConnected({ walletType: WalletType.Metamask })
    return <AccountSuccessAlert message="Your MetaMask wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default MetamaskStatusAlert
