import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import chainIdToNetworkName from "../../../../utils/chainIdToNetworkName"
import { getEnvVariable } from "../../../../utils/getEnvVariable"
import { EnvVariable } from "../../../../enums"

const IncorrectNetworkAlert: FC = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <Stack>
        <AlertTitle>Incorrect Network</AlertTitle>
        <AlertDescription mt={2}>
          Please connect to{" "}
          {chainIdToNetworkName(getEnvVariable(EnvVariable.SupportedChainId))}
        </AlertDescription>
      </Stack>
    </Alert>
  )
}

export default IncorrectNetworkAlert
