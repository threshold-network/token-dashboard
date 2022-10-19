import { FC } from "react"
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"
import { ExternalHref } from "../../../../enums"
import Link from "../../../Link"

const MetamaskNotInstalledAlert: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        MetaMask is not installed. Please install the MetaMask extension on{" "}
        <Link isExternal href={ExternalHref.metamaskHomePage}>
          their website
        </Link>
      </AlertDescription>
    </Alert>
  )
}

export default MetamaskNotInstalledAlert
