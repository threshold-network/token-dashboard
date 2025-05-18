import { FC, useEffect, useState, ReactElement } from "react"
import {
  Box,
  Stack,
  Center,
  Text,
  Alert,
  AlertIcon,
  Button,
  Spinner,
  VStack,
  useColorModeValue,
  HStack,
  Image,
} from "@chakra-ui/react"
import { useWallet, ErrorCode, IWallet, Wallet } from "@suiet/wallet-kit"
import { WalletConnectionModalBase } from "./components"
import { SUIIcon } from "../../../static/icons/SUI"

const ConnectSUI: FC<{
  goBack: () => void
  closeModal: () => void
}> = ({ goBack, closeModal }) => {
  const { connected, account, connecting, select, allAvailableWallets } =
    useWallet()

  const [displayError, setDisplayError] = useState<string | null>(null)
  const [selectedWalletName, setSelectedWalletName] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (connected && account) {
      closeModal()
    }
  }, [connected, account, closeModal])

  useEffect(() => {
    if (!connecting) {
      if (
        !displayError?.includes("Failed to connect") &&
        !displayError?.includes("rejected")
      ) {
        setDisplayError(null)
      }
    }
  }, [connecting, displayError])

  const handleConnect = async (walletName: string) => {
    setSelectedWalletName(walletName)
    setDisplayError(null)
    try {
      await select(walletName)
    } catch (e: any) {
      console.error(`SUI select(${walletName}) caught error:`, e)
      let message = "Failed to connect to selected SUI wallet."
      if (
        e &&
        typeof e === "object" &&
        e.code === ErrorCode.WALLET__CONNECT_ERROR__USER_REJECTED
      ) {
        message = "Connection request rejected by user."
      } else if (e && typeof e === "object" && e.message) {
        message = e.message
      } else if (typeof e === "string") {
        message = e
      }
      setDisplayError(message)
      setSelectedWalletName(null)
    }
  }

  const getWalletIconElement = (wallet: IWallet): ReactElement | undefined => {
    let iconSrc: string | undefined = undefined
    if (wallet.adapter && typeof wallet.adapter.icon === "string") {
      iconSrc = wallet.adapter.icon
    }

    if (iconSrc) {
      return (
        <Image
          src={iconSrc}
          alt={`${wallet.name} icon`}
          boxSize="28px"
          borderRadius="md"
        />
      )
    }
    return undefined
  }

  const isLoadingThisWallet = (walletName: string) =>
    !!(connecting && selectedWalletName === walletName)
  const isAnotherWalletConnecting = !!(
    connecting && selectedWalletName !== null
  )

  let content: ReactElement
  if (isLoadingThisWallet(selectedWalletName || "") && selectedWalletName) {
    content = (
      <VStack spacing={4} justifyContent="center" h="100%" pt={4}>
        <Spinner size="xl" color="blue.500" />
        <Text>Connecting to {selectedWalletName}...</Text>
      </VStack>
    )
  } else if (connecting && !selectedWalletName) {
    content = (
      <VStack spacing={4} justifyContent="center" h="100%" pt={4}>
        <Spinner size="xl" color="blue.500" />
        <Text>Attempting to connect...</Text>
      </VStack>
    )
  } else if (displayError) {
    content = (
      <VStack spacing={4} justifyContent="center" h="100%" pt={4}>
        <Alert status="error" borderRadius="md" variant="subtle">
          <AlertIcon />
          <Box flex="1">
            <Text fontSize="sm">{displayError}</Text>
          </Box>
        </Alert>
        <Button onClick={goBack} colorScheme="blue" variant="outline" mt={2}>
          Go Back
        </Button>
      </VStack>
    )
  } else if (allAvailableWallets.length === 0) {
    content = (
      <Text
        color={useColorModeValue("gray.600", "gray.400")}
        textAlign="center"
        py={4}
        pt={4}
      >
        No SUI wallets detected. Please install a SUI wallet extension.
      </Text>
    )
  } else {
    content = (
      <VStack spacing={3} width="100%" align="stretch">
        {allAvailableWallets.map((wallet: IWallet) => (
          <Button
            key={wallet.name}
            onClick={() => handleConnect(wallet.name)}
            variant="outline"
            size="lg"
            width="100%"
            leftIcon={getWalletIconElement(wallet)}
            isDisabled={
              isAnotherWalletConnecting && selectedWalletName !== wallet.name
            }
            justifyContent="flex-start"
            py={6}
            px={4}
            borderColor={useColorModeValue("gray.300", "gray.600")}
            _hover={{
              bg: useColorModeValue("gray.100", "gray.700"),
              borderColor: useColorModeValue("gray.400", "gray.500"),
            }}
          >
            <Text fontWeight="medium">{wallet.name}</Text>
            {!wallet.installed && (
              <Text
                as="span"
                fontSize="xs"
                color="gray.500"
                ml={2}
                fontWeight="normal"
              >
                (Not Installed)
              </Text>
            )}
          </Button>
        ))}
      </VStack>
    )
  }

  return (
    <WalletConnectionModalBase
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={SUIIcon}
      title="Connect SUI Wallet"
      subTitle={
        selectedWalletName && connecting
          ? ""
          : "Select your preferred SUI wallet from the list below."
      }
    >
      <Box pt={3} px={1} minH="200px">
        {content}
      </Box>
    </WalletConnectionModalBase>
  )
}

export default ConnectSUI
