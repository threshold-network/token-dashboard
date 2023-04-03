import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"
import { WalletType } from "../../../../enums"
import { useCapture } from "../../../../hooks/posthog"
import { PosthogEvent } from "../../../../types/posthog"

const CoinbaseStatusAlert: FC<{
  connectionRejected?: boolean
  unsupportedChainId?: boolean
}> = ({ connectionRejected, unsupportedChainId }) => {
  const { active } = useWeb3React()
  const captureWalletConnected = useCapture(PosthogEvent.WalletConnected)

  if (connectionRejected) {
    return <WalletRejectedAlert />
  }

  if (unsupportedChainId) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>Unsupported Network.</AlertDescription>
      </Alert>
    )
  }

  if (active) {
    captureWalletConnected({ walletType: WalletType.Coinbase })
    return <AccountSuccessAlert message="Your coinbase wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default CoinbaseStatusAlert
