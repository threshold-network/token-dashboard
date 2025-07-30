import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { FiCheck } from "react-icons/fi"
import { BodySm } from "@threshold-network/components"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import { BridgeRoute } from "../../../../threshold-ts/bridge"
import { BridgeNetwork } from "./NetworkSelector"

interface BridgeTypeSelectorProps {
  fromNetwork: BridgeNetwork
  toNetwork: BridgeNetwork
  bridgeRoute: BridgeRoute | null
  withdrawalTime?: number
}

const BridgeTypeSelector: FC<BridgeTypeSelectorProps> = ({
  fromNetwork,
  toNetwork,
  bridgeRoute,
  withdrawalTime,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const activeBg = useColorModeValue("brand.50", "brand.900")
  const activeBorder = useColorModeValue("brand.500", "brand.400")
  const disabledOpacity = 0.5

  // Determine which bridges are available
  const isEthereumToBob =
    (fromNetwork === SupportedChainIds.Ethereum ||
      fromNetwork === SupportedChainIds.Sepolia) &&
    (toNetwork === SupportedChainIds.Bob ||
      toNetwork === SupportedChainIds.BobSepolia)

  const isBobToEthereum =
    (fromNetwork === SupportedChainIds.Bob ||
      fromNetwork === SupportedChainIds.BobSepolia) &&
    (toNetwork === SupportedChainIds.Ethereum ||
      toNetwork === SupportedChainIds.Sepolia)

  // For Ethereum to Bob, only CCIP is available
  const ccipEnabled =
    isEthereumToBob || (isBobToEthereum && bridgeRoute === "ccip")
  const standardEnabled = isBobToEthereum && bridgeRoute === "standard"

  const BridgeBox = ({
    title,
    isActive,
    isDisabled,
  }: {
    title: string
    isActive: boolean
    isDisabled: boolean
  }) => (
    <Box
      bg={isActive ? activeBg : bgColor}
      border="2px solid"
      borderColor={isActive ? activeBorder : borderColor}
      borderRadius="lg"
      p={4}
      flex={1}
      opacity={isDisabled ? disabledOpacity : 1}
      position="relative"
      transition="all 0.2s"
    >
      <HStack justify="space-between">
        <Text fontWeight="bold">{title}</Text>
        {isActive && (
          <Box bg={activeBorder} borderRadius="full" p={1} color="white">
            <Icon as={FiCheck} boxSize={3} />
          </Box>
        )}
      </HStack>
    </Box>
  )

  const formatTime = (seconds?: number): string => {
    if (!seconds) return ""
    if (seconds < 3600) {
      return `~${Math.round(seconds / 60)} minutes`
    }
    const days = Math.floor(seconds / 86400)
    return `${days} day${days > 1 ? "s" : ""}`
  }

  return (
    <VStack spacing={4} w="full">
      <Flex gap={4} w="full">
        <BridgeBox
          title="Standard BOB Bridge"
          isActive={standardEnabled}
          isDisabled={!standardEnabled && !ccipEnabled}
        />
        <BridgeBox
          title="CCIP Bridge"
          isActive={ccipEnabled}
          isDisabled={!ccipEnabled && !standardEnabled}
        />
      </Flex>

      {/* Show alert based on active bridge type */}
      {standardEnabled && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <BodySm fontWeight="bold">
              Standard Bridge: {formatTime(withdrawalTime)}
            </BodySm>
            <BodySm>
              Your withdrawal will take 7 days to complete using the Standard
              Bridge. This is a security feature of the Optimism protocol.{" "}
              <Text
                as="a"
                href="https://community.optimism.io/docs/developers/bridge/standard-bridge/"
                target="_blank"
                rel="noopener noreferrer"
                color="brand.500"
                textDecoration="underline"
              >
                Learn more
              </Text>
            </BodySm>
          </VStack>
        </Alert>
      )}

      {ccipEnabled && (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <BodySm fontWeight="bold">
              CCIP Bridge: {formatTime(withdrawalTime)}
            </BodySm>
            <BodySm>
              Your transfer will complete in approximately 20-60 minutes using
              Chainlink's Cross-Chain Interoperability Protocol (CCIP).
            </BodySm>
          </VStack>
        </Alert>
      )}
    </VStack>
  )
}

export default BridgeTypeSelector
