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
import { WalletConnectIcon } from "../../../static/icons/WalletConect"
import { useWeb3React } from "@web3-react/core"
import injected from "../../../web3/connectors/injected"
import { mode } from "@chakra-ui/theme-tools"
import shortenAddress from "../../../utils/shortenAddress"
import { walletconnect } from "../../../web3/connectors/walletConnect"

export enum WalletConnectConnectionError {
  notInstalled = "No Ethereum provider was found on window.ethereum",
  rejectedConnection = "The user rejected the request.",
}

const ConnectWalletConnect: FC<{ goBack: () => void; closeModal: () => void }> =
  ({ goBack, closeModal }) => {
    const { error, activate, active, account } = useWeb3React()

    return (
      <>
        <ModalBody>
          <Stack spacing={6}>
            <HStack justify="center">
              <Icon as={WalletConnectIcon} h="40px" w="40px" mr={4} />
              <Text fontSize="30px">WalletConnect</Text>
            </HStack>
            {!active && (
              <Text
                align="center"
                color={useColorModeValue("gray.500", "white")}
              >
                Connect WalletConnect via the generated QR code.
              </Text>
            )}

            {active && account ? (
              <Alert status="success">
                <AlertIcon />
                <Stack>
                  <AlertTitle>
                    Your WalletConnect wallet is connected
                  </AlertTitle>
                  <AlertDescription mt={2}>
                    Address: {shortenAddress(account)}
                  </AlertDescription>
                </Stack>
              </Alert>
            ) : (
              <Alert>
                <Spinner
                  thickness="2px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  mr={4}
                />
                <AlertDescription>
                  Initializing wallet connection...
                </AlertDescription>
              </Alert>
            )}
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
            WalletConnectConnectionError.rejectedConnection
          ) && (
            <Button
              ml={4}
              onClick={() => {
                // the user has already tried to connect, so we manually reset the connector to allow the QR popup to work again
                walletconnect.walletConnectProvider = undefined
                activate(walletconnect)
              }}
            >
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

export default ConnectWalletConnect
