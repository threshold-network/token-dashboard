import { FC } from "react"
import { Alert, AlertDescription, AlertIcon, Link } from "@chakra-ui/react"

const MetamaskNotInstalledAlert: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        MetaMask is not installed. Please install the MetaMask extension on{" "}
        <Link href="https://metamask.io/">their website</Link>
      </AlertDescription>
    </Alert>
  )
}

export default MetamaskNotInstalledAlert
