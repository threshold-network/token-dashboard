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
import { RootState } from "../../store"
import { useSelector } from "react-redux"

const WalletConnectionAlert: FC<{
  account?: string | null
  chainId?: number
}> = ({ account, chainId }) => {
  const { isBlocked } = useSelector((state: RootState) => state.account.trm)
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

    if (!account || (account && isSupportedNetwork(chainId)) || !isBlocked) {
      setHideAlert(true)
      return
    }

    if (isBlocked) {
      setAlertDescription(
        `Your wallet has been flagged in our risk assessment screening. The 
        Contract interactions are currently disabled.`
      )
      setHideAlert(false)
      setAlertStatus("error")
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
  }, [account, chainId, isBlocked, errorMessage])

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
    <Alert
      status={alertStatus}
      variant="solid"
      position="absolute"
      w="fit-content"
      paddingRight="40px"
      top="94px"
      right="5.25rem"
      zIndex="10"
      ml="4rem"
    >
      <AlertIcon />
      <AlertDescription>{alertDescription}</AlertDescription>
      <CloseButton
        position="absolute"
        right="8px"
        top="8px"
        onClick={resetAlert}
      />
    </Alert>
  )
}

export default WalletConnectionAlert
