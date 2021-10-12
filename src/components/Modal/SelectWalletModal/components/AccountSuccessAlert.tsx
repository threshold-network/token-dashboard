import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Stack,
} from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"

const AccountSuccessAlert: FC<{ message: string }> = ({ message }) => {
  const { account } = useWeb3React()

  return (
    <Alert status="success">
      <AlertIcon />
      <Stack>
        <AlertTitle>{message}</AlertTitle>
        <AlertDescription mt={2}>
          Address: {shortenAddress(account || "")}
        </AlertDescription>
      </Stack>
    </Alert>
  )
}

export default AccountSuccessAlert
