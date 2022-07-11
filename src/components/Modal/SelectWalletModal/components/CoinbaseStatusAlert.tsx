import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  AccountSuccessAlert,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "."
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"

const CoinbaseStatusAlert: FC<{
  connectionRejected?: boolean
  unsupportedChainId?: boolean
}> = ({ connectionRejected, unsupportedChainId }) => {
  const { active } = useWeb3React()

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
    return <AccountSuccessAlert message="Your coinbase wallet is connected" />
  }
  return <WalletInitializeAlert />
}

export default CoinbaseStatusAlert
