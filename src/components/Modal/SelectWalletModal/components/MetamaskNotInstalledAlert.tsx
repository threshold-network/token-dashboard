import { FC } from "react"
import { Alert, AlertDescription, AlertIcon, Link } from "@chakra-ui/react"
import { ExternalLink } from "../../../../enums"

const MetamaskNotInstalledAlert: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        MetaMask is not installed. Please install the MetaMask extension on{" "}
        <Link target="_blank" href={ExternalLink.metamaskHomePage}>
          their website
        </Link>
      </AlertDescription>
    </Alert>
  )
}

export default MetamaskNotInstalledAlert
