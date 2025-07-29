import { FC } from "react"
import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { FiArrowLeft, FiArrowRight } from "react-icons/fi"
import { BodySm, LineDivider } from "@threshold-network/components"
import { EthereumLight } from "../../../static/icons/EthereumLight"
import { EthereumDark } from "../../../static/icons/EthereumDark"
import { SupportedChainIds } from "../../../networks/enums/networks"
import { useColorMode } from "@chakra-ui/react"

export type BridgeNetwork =
  | SupportedChainIds.Ethereum
  | SupportedChainIds.Sepolia
  | SupportedChainIds.Bob
  | SupportedChainIds.BobSepolia

interface NetworkSelectorProps {
  fromNetwork: BridgeNetwork
  toNetwork: BridgeNetwork
  onSwap: () => void
  onFromNetworkChange: (network: BridgeNetwork) => void
  onToNetworkChange: (network: BridgeNetwork) => void
}

const getNetworkIcon = (chainId: BridgeNetwork, colorMode: string) => {
  const ethereumLogo = colorMode === "light" ? EthereumDark : EthereumLight

  switch (chainId) {
    case SupportedChainIds.Ethereum:
    case SupportedChainIds.Sepolia:
      return <Icon as={ethereumLogo} boxSize="6" />
    case SupportedChainIds.Bob:
    case SupportedChainIds.BobSepolia:
      // TODO: Add BOB icon when available
      return <Icon as={ethereumLogo} boxSize="6" />
    default:
      return <Icon as={ethereumLogo} boxSize="6" />
  }
}

const getNetworkName = (chainId: BridgeNetwork): string => {
  switch (chainId) {
    case SupportedChainIds.Ethereum:
      return "Ethereum"
    case SupportedChainIds.Sepolia:
      return "Sepolia"
    case SupportedChainIds.Bob:
      return "BOB"
    case SupportedChainIds.BobSepolia:
      return "BOB Sepolia"
    default:
      return "Unknown"
  }
}

const getAvailableNetworks = (
  currentNetwork: BridgeNetwork
): BridgeNetwork[] => {
  // Mainnet networks
  if (
    currentNetwork === SupportedChainIds.Ethereum ||
    currentNetwork === SupportedChainIds.Bob
  ) {
    return [SupportedChainIds.Ethereum, SupportedChainIds.Bob]
  }
  // Testnet networks
  return [SupportedChainIds.Sepolia, SupportedChainIds.BobSepolia]
}

const NetworkSelector: FC<NetworkSelectorProps> = ({
  fromNetwork,
  toNetwork,
  onSwap,
  onFromNetworkChange,
  onToNetworkChange,
}) => {
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.100", "gray.700")

  const availableFromNetworks = getAvailableNetworks(fromNetwork)
  const availableToNetworks = getAvailableNetworks(toNetwork)

  const NetworkBox = ({
    label,
    network,
    networks,
    onChange,
  }: {
    label: string
    network: BridgeNetwork
    networks: BridgeNetwork[]
    onChange: (network: BridgeNetwork) => void
  }) => (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      flex={1}
    >
      <VStack align="start" spacing={2}>
        <BodySm color="gray.500" fontWeight="medium">
          {label}
        </BodySm>
        <Menu>
          <MenuButton
            as={HStack}
            spacing={3}
            cursor="pointer"
            _hover={{ bg: hoverBg }}
            borderRadius="md"
            p={2}
            w="full"
            transition="all 0.2s"
          >
            {getNetworkIcon(network, colorMode)}
            <Text fontWeight="bold" flex={1} textAlign="left">
              {getNetworkName(network)}
            </Text>
            <ChevronDownIcon boxSize={5} />
          </MenuButton>
          <MenuList>
            {networks
              .filter((n) => n !== network)
              .map((n) => (
                <MenuItem
                  key={n}
                  icon={getNetworkIcon(n, colorMode)}
                  onClick={() => onChange(n)}
                >
                  {getNetworkName(n)}
                </MenuItem>
              ))}
          </MenuList>
        </Menu>
      </VStack>
    </Box>
  )

  return (
    <VStack spacing={6} w="full">
      <Flex gap={4} w="full" align="center">
        <NetworkBox
          label="From"
          network={fromNetwork}
          networks={availableFromNetworks}
          onChange={onFromNetworkChange}
        />

        <IconButton
          aria-label="Swap networks"
          icon={
            <HStack spacing={0}>
              <Icon as={FiArrowRight} />
              <Icon as={FiArrowLeft} />
            </HStack>
          }
          variant="ghost"
          onClick={onSwap}
          size="sm"
          borderRadius="full"
          _hover={{ bg: hoverBg }}
        />

        <NetworkBox
          label="To"
          network={toNetwork}
          networks={availableToNetworks}
          onChange={onToNetworkChange}
        />
      </Flex>

      <LineDivider />
    </VStack>
  )
}

export default NetworkSelector
