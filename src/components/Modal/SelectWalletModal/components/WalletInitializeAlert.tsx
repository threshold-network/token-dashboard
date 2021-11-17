import { FC } from "react"
import { Alert, AlertDescription, Spinner } from "@chakra-ui/react"

const WalletInitializeAlert: FC = () => {
  return (
    <Alert>
      <Spinner
        thickness="2px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        mr={4}
      />
      <AlertDescription>Initializing wallet connection...</AlertDescription>
    </Alert>
  )
}

export default WalletInitializeAlert
