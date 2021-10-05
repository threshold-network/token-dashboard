import { FC } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  HStack,
  Icon,
  Link,
  ModalBody,
  ModalFooter,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react"
import { BiLeftArrow } from "react-icons/all"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import injected from "../../../web3/connectors/injected"
import { useModal } from "../../../store/modal"

export enum MetaMaskConnectionError {
  notInstalled = "No Ethereum provider was found on window.ethereum",
  rejectedConnection = "The user rejected the request.",
}

const MetamaskStatusAlert: FC = () => {
  const { error, active, account } = useWeb3React()

  if (error?.message.includes(MetaMaskConnectionError.notInstalled)) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>
          MetaMask is not installed. Please install the MetaMask extension on{" "}
          <Link>their website</Link>
        </AlertDescription>
      </Alert>
    )
  }

  if (error?.message.includes(MetaMaskConnectionError.rejectedConnection)) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>
          User rejected the connection request.
        </AlertDescription>
      </Alert>
    )
  }

  if (active && account) {
    return (
      <Alert status="success">
        <AlertIcon />
        <Stack>
          <AlertTitle>Your MetaMask wallet is connected</AlertTitle>
          <AlertDescription mt={2}>Address: {account}</AlertDescription>
        </Stack>
      </Alert>
    )
  }

  return (
    <Alert>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
      />
      <AlertDescription>Initializing wallet connection...</AlertDescription>
    </Alert>
  )
}

const ConnectMetamask: FC<{ goBack: () => void }> = ({ goBack }) => {
  const { error, activate, active, account } = useWeb3React()
  const { closeModal } = useModal()

  return (
    <>
      <ModalBody>
        <Stack spacing={6}>
          <HStack justify="center">
            <Icon as={MetaMaskIcon} h="40px" w="40px" mr={4} />
            <Text color="gray.800" fontSize="30px">
              MetaMask
            </Text>
          </HStack>
          <Text align="center" color="gray.500">
            The MetaMask extension will open in an external window.
          </Text>
          <MetamaskStatusAlert />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" leftIcon={<BiLeftArrow />} onClick={goBack}>
          Change Wallet
        </Button>

        {error?.message.includes(
          MetaMaskConnectionError.rejectedConnection
        ) && (
          <Button ml={4} onClick={() => activate(injected)}>
            Try again
          </Button>
        )}

        {active && account && (
          <Button ml={4} onClick={closeModal}>
            View Dashboard
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

export default ConnectMetamask
