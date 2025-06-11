import React, { FC, useEffect, useState } from "react"
import {
  ModalBody,
  Stack,
  HStack,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react"
import { BiLeftArrowAlt } from "react-icons/bi"
import { H4, BodyMd } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import { useStarknetConnection } from "../../../hooks/useStarknetConnection"
import { StarknetIcon } from "../../../static/icons/Starknet"
import { ArgentIcon } from "../../../static/icons/Argent"

interface Props extends BaseModalProps {
  goBack: () => void
}

export const ConnectStarknet: FC<Props> = ({ goBack, closeModal }) => {
  const { connect, isConnected, isConnecting, error, availableWallets } =
    useStarknetConnection()

  const [localError, setLocalError] = useState<string | null>(null)
  const buttonBg = useColorModeValue("gray.50", "gray.700")
  const buttonHoverBg = useColorModeValue("gray.100", "gray.600")

  useEffect(() => {
    // Auto-close modal when successfully connected
    if (isConnected) {
      closeModal()
    }
  }, [isConnected, closeModal])

  useEffect(() => {
    // Update local error state from connection error
    if (error) {
      setLocalError(error.message || "Failed to connect wallet")
    } else {
      setLocalError(null)
    }
  }, [error])

  const handleConnect = async () => {
    try {
      setLocalError(null)
      await connect()
    } catch (err: any) {
      setLocalError(err?.message || "Failed to connect wallet")
    }
  }

  const getWalletIcon = (walletId: string) => {
    if (walletId.toLowerCase().includes("argent")) {
      return <ArgentIcon />
    }
    // Default to Starknet icon for other wallets
    return <StarknetIcon />
  }

  return (
    <>
      <ModalBody>
        <Stack spacing={6}>
          <HStack justify="center">
            <StarknetIcon />
          </HStack>

          <VStack>
            <H4>Connect StarkNet Wallet</H4>
            <BodyMd color="gray.500" textAlign="center">
              Connect your StarkNet wallet to interact with tBTC on StarkNet
            </BodyMd>
          </VStack>

          {isConnecting ? (
            <VStack spacing={4} py={4}>
              <Spinner size="lg" color="brand.500" />
              <Text fontSize="sm" color="gray.500">
                Connecting to your wallet...
              </Text>
            </VStack>
          ) : (
            <VStack spacing={3} width="100%">
              {availableWallets.length > 0 ? (
                <>
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    Available wallets:
                  </Text>
                  {availableWallets.map((wallet) => (
                    <Button
                      key={wallet.id}
                      variant="outline"
                      width="100%"
                      height="auto"
                      py={3}
                      px={4}
                      justifyContent="flex-start"
                      bg={buttonBg}
                      _hover={{ bg: buttonHoverBg }}
                      onClick={handleConnect}
                      isDisabled={isConnecting}
                    >
                      <HStack spacing={3} width="100%">
                        {getWalletIcon(wallet.id)}
                        <Text fontWeight="medium">{wallet.name}</Text>
                      </HStack>
                    </Button>
                  ))}
                </>
              ) : (
                <Button
                  variant="solid"
                  colorScheme="brand"
                  width="100%"
                  size="lg"
                  onClick={handleConnect}
                  isLoading={isConnecting}
                  loadingText="Connecting..."
                >
                  Connect Starknet Wallet
                </Button>
              )}
            </VStack>
          )}

          {localError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">{localError}</AlertDescription>
            </Alert>
          )}

          {!isConnecting && availableWallets.length === 0 && (
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">
                No StarkNet wallets detected. Please install Argent X or
                Braavos.
              </AlertDescription>
            </Alert>
          )}

          <Button
            leftIcon={<Icon as={BiLeftArrowAlt} />}
            variant="ghost"
            onClick={goBack}
            isDisabled={isConnecting}
          >
            Back
          </Button>
        </Stack>
      </ModalBody>
    </>
  )
}
