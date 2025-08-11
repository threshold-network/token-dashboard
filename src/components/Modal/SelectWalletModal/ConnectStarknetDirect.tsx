import React, { FC, useEffect, useState } from "react"
import {
  Stack,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  Spinner,
  Icon,
  useColorModeValue,
  StackDivider,
  ModalBody,
} from "@chakra-ui/react"
import { BiRightArrowAlt, BiLeftArrowAlt } from "react-icons/all"
import { H4 } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import { useStarknetConnection } from "../../../hooks/useStarknetConnection"
import { StarknetIcon } from "../../../static/icons/Starknet"
import { ArgentIcon } from "../../../static/icons/Argent"

interface Props extends BaseModalProps {
  goBack: () => void
}

export const ConnectStarknetDirect: FC<Props> = ({ goBack, closeModal }) => {
  const { connect, isConnected, isConnecting, error, availableWallets } =
    useStarknetConnection()

  const [localError, setLocalError] = useState<string | null>(null)
  const buttonBg = useColorModeValue("gray.50", "gray.700")
  const buttonHoverBg = useColorModeValue("gray.100", "gray.600")

  // Auto-connect on mount like Ledger Live does
  useEffect(() => {
    const autoConnect = async () => {
      try {
        // Close the modal immediately to let the wallet's own modal take over
        closeModal()
        await connect()
      } catch (err: any) {
        setLocalError(err?.message || "Failed to connect wallet")
      }
    }

    autoConnect()
  }, [connect, closeModal])

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
                  {availableWallets.map((wallet) => (
                    <Button
                      key={wallet.id}
                      variant="unstyled"
                      width="100%"
                      height="100px"
                      justifyContent="flex-start"
                      bg={buttonBg}
                      _hover={{ bg: buttonHoverBg }}
                      onClick={handleConnect}
                      isDisabled={isConnecting}
                      borderRadius={0}
                    >
                      <Stack
                        justify="space-between"
                        direction="row"
                        px="40px"
                        width="100%"
                      >
                        <Stack direction="row" align="center">
                          <Icon
                            as={() => getWalletIcon(wallet.id)}
                            h="40px"
                            w="40px"
                            mr="32px"
                          />
                          <Text fontSize="lg" fontWeight="bold">
                            {wallet.name}
                          </Text>
                        </Stack>
                        <Icon
                          as={BiLeftArrowAlt}
                          h="40px"
                          w="40px"
                          transform="rotate(180deg)"
                        />
                      </Stack>
                    </Button>
                  ))}
                </>
              ) : (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    No Starknet wallets detected. Please install Argent X or
                    Braavos.
                  </AlertDescription>
                </Alert>
              )}
            </VStack>
          )}

          {localError && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertDescription fontSize="sm">{localError}</AlertDescription>
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
