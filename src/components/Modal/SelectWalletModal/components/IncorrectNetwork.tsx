import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"

const IncorrectNetworkAlert: FC = () => {
  return (
    <Alert status="error">
      <AlertIcon />
      <Stack>
        <AlertTitle>Incorrect Network</AlertTitle>
        <AlertDescription mt={2}>
          Please connect to a supported network.
        </AlertDescription>
      </Stack>
    </Alert>
  )
}

export default IncorrectNetworkAlert
