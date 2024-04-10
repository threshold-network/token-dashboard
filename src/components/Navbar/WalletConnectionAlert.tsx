import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  CloseButton,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import isSupportedNetwork from "../../utils/isSupportedNetwork"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import { supportedChainId } from "../../utils/getEnvVariable"
import { useWeb3React } from "@web3-react/core"

const WalletConnectionAlert: FC<{
  account?: string | null
  chainId?: number
}> = ({ account, chainId }) => {
  const [hideAlert, setHideAlert] = useState(false)
  const { error, deactivate } = useWeb3React()
  const [alertDescription, setAlertDescription] = useState("")
  const [alertStatus, setAlertStatus] = useState<AlertStatus>("warning")

  const errorMessage = error?.message

  useEffect(() => {
    if (errorMessage) {
      setAlertDescription(errorMessage)
      setHideAlert(false)
      return
    }

    if (!account || (account && isSupportedNetwork(chainId))) {
      setHideAlert(true)
      return
    }

    if (!isSupportedNetwork(chainId)) {
      setAlertDescription(
        `Your wallet is on an unsupported network. Switch to the ${chainIdToNetworkName(
          supportedChainId
        )} network`
      )
      setAlertStatus("warning")
      setHideAlert(false)
      return
    }
  }, [account, chainId, errorMessage])

  const resetAlert = () => {
    setHideAlert(true)
    setAlertDescription("")
    setAlertStatus("warning")
    deactivate()
  }

  if (hideAlert) {
    return null
  }

  return (
    <Alert status={alertStatus} variant="solid" w="fit-content">
      <AlertIcon alignSelf="center" />
      <AlertDescription>{alertDescription}</AlertDescription>
      <CloseButton onClick={resetAlert} />
    </Alert>
  )
}

export default WalletConnectionAlert
