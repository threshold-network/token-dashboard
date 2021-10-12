import { FC } from "react"
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"

const WalletRejectedAlert: FC = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>User rejected the connection request.</AlertDescription>
    </Alert>
  )
}

export default WalletRejectedAlert
