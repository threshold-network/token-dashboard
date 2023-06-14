import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react"
import { FC, useEffect, useMemo, useState } from "react"
import isSupportedNetwork from "../../utils/isSupportedNetwork"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import { supportedChainId } from "../../utils/getEnvVariable"

const WalletConnectionAlert: FC<{
  account?: string | null
  chainId?: number
}> = ({ account, chainId }) => {
  const [hideAlert, setHideAlert] = useState(false)

  const alertDescription = useMemo(() => {
    if (!account) {
      setHideAlert(false)
      return
    }

    if (!isSupportedNetwork(chainId)) {
      return `Your wallet is on an unsupported network. Switch to the ${chainIdToNetworkName(
        supportedChainId
      )} network`
    }
  }, [account, chainId])

  useEffect(() => {
    if (!account || (account && isSupportedNetwork(chainId))) {
      setHideAlert(true)
      return
    }

    if (!isSupportedNetwork(chainId)) {
      setHideAlert(false)
      return
    }
  }, [account, chainId])

  if (hideAlert) {
    return null
  }

  return (
    <Alert
      status="warning"
      variant="solid"
      position="absolute"
      w="fit-content"
      paddingRight="40px"
      top="94px"
      right="5.25rem"
    >
      <AlertIcon />
      <AlertDescription>{alertDescription}</AlertDescription>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={() => setHideAlert(true)}
      />
    </Alert>
  )
}

export default WalletConnectionAlert
