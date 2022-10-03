import { FC } from "react"
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react"
import { ExternalHref } from "../../../../enums"
import ExternalLink from "../../../ExternalLink"

const MetamaskNotInstalledAlert: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        MetaMask is not installed. Please install the MetaMask extension on{" "}
        <ExternalLink
          isExternal
          href={ExternalHref.metamaskHomePage}
          text="their website"
        />
      </AlertDescription>
    </Alert>
  )
}

export default MetamaskNotInstalledAlert
