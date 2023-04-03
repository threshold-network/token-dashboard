import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."
import { useCapture } from "../../../../hooks/posthog"
import { PosthogEvent } from "../../../../types/posthog"
import { WalletType } from "../../../../enums"

const TrezorStatusAlert: FC<{
  connectionRejected?: boolean
  active?: boolean
}> = ({ connectionRejected }) => {
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)
  const { active } = useWeb3React()

  if (connectionRejected) {
    return <WalletRejectedAlert />
  }
  if (active) {
    captureWalletConnected({ walletType: WalletType.Trezor })
    return <AccountSuccessAlert message="Your Trezor wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default TrezorStatusAlert
