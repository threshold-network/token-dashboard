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
  useColorModeValue,
} from "@chakra-ui/react"
import { BiLeftArrow, BiLeftArrowAlt } from "react-icons/all"
import { MetaMaskIcon } from "../../../static/icons/MetaMask"
import { useWeb3React } from "@web3-react/core"
import injected from "../../../web3/connectors/injected"
import { mode } from "@chakra-ui/theme-tools"
import shortenAddress from "../../../utils/shortenAddress"

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
          <AlertDescription mt={2}>
            Address: {shortenAddress(account)}
          </AlertDescription>
        </Stack>
      </Alert>
    )
  }

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

const ConnectMetamask: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { error, activate, active, account } = useWeb3React()

  return (
    <>
      <ModalBody>
        <Stack spacing={6}>
          <HStack justify="center">
            <Icon as={MetaMaskIcon} h="40px" w="40px" mr={4} />
            <Text fontSize="30px">MetaMask</Text>
          </HStack>
          <Text align="center" color={useColorModeValue("gray.500", "white")}>
            The MetaMask extension will open in an external window.
          </Text>
          <MetamaskStatusAlert />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="outline"
          leftIcon={<BiLeftArrowAlt />}
          onClick={goBack}
        >
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
