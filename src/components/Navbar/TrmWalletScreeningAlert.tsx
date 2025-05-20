import {
  Alert,
  AlertDescription,
  AlertIcon,
  CloseButton,
} from "@chakra-ui/react"
import { FC, useEffect, useState } from "react"
import { RootState } from "../../store"
import { useSelector } from "react-redux"

const TrmWalletScreeningAlert: FC = () => {
  const isTemporarilyDisabled = true // TODO: remove this
  const { isBlocked } = useSelector((state: RootState) => state.account)
  const [hideAlert, setHideAlert] = useState(true)

  const [alertDescription, setAlertDescription] = useState("")

  useEffect(() => {
    if (!isTemporarilyDisabled && !isBlocked) {
      setHideAlert(true)
      return
    }

    if (isTemporarilyDisabled) {
      setAlertDescription(
        `The minting functionality is temporarily unavailable, we will restore the service as soon as possible.`
      )
      setHideAlert(false)
      return
    }

    if (isBlocked) {
      setAlertDescription(
        `Your wallet has been flagged in our risk assessment screening. The 
        Contract interactions are currently disabled.`
      )
      setHideAlert(false)
      return
    }
  }, [isBlocked])

  const resetAlert = () => {
    setHideAlert(true)
    setAlertDescription("")
  }

  if (hideAlert) {
    return null
  }

  return (
    <Alert
      status={isTemporarilyDisabled ? "warning" : "error"}
      variant="solid"
      w="fit-content"
    >
      <AlertIcon alignSelf="center" />
      <AlertDescription>{alertDescription}</AlertDescription>
      <CloseButton onClick={resetAlert} />
    </Alert>
  )
}

export default TrmWalletScreeningAlert
