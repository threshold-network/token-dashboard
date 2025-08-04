import { FC, useMemo } from "react"
import {
  Button,
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Text,
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { useStarknetConnection } from "../../hooks/useStarknetConnection"
import { useStarknetWallet } from "../../contexts/StarknetWalletProvider"
import {
  ENABLED_STARKNET_NETWORKS,
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
  getEnabledStarkNetChainIds,
} from "../../config/starknet"
import { useIsActive } from "../../hooks/useIsActive"

interface StarkNetNetwork {
  chainId: string
  name: string
  isTestnet: boolean
}

// Build network list based on enabled networks
const STARKNET_NETWORKS: StarkNetNetwork[] = []

if (ENABLED_STARKNET_NETWORKS.mainnet && STARKNET_MAINNET_CHAIN_ID) {
  STARKNET_NETWORKS.push({
    chainId: STARKNET_MAINNET_CHAIN_ID,
    name: "Starknet Mainnet",
    isTestnet: false,
  })
}

if (ENABLED_STARKNET_NETWORKS.sepolia && STARKNET_SEPOLIA_CHAIN_ID) {
  STARKNET_NETWORKS.push({
    chainId: STARKNET_SEPOLIA_CHAIN_ID,
    name: "Starknet Sepolia",
    isTestnet: true,
  })
}

const StarknetNetworkButton: FC = () => {
  const { colorMode } = useColorMode()
  const { chainId, isConnected } = useStarknetConnection()
  const { switchNetwork } = useStarknetWallet()
  const { account: evmAccount } = useIsActive()
  const toast = useToast()

  // All hooks must be called before any conditional returns
  const buttonBg = useColorModeValue("gray.100", "gray.700")
  const hoverBg = useColorModeValue("gray.200", "gray.600")

  const currentNetwork = useMemo(() => {
    // Check if current chain is enabled
    const network = STARKNET_NETWORKS.find(
      (network) => network.chainId === chainId
    )
    if (network) return network

    // If current network is disabled, return first enabled network or null
    return STARKNET_NETWORKS[0] || null
  }, [chainId])

  // Check if wallet is on a disabled network
  const isOnDisabledNetwork = useMemo(() => {
    if (!chainId) return false
    const enabledChainIds = getEnabledStarkNetChainIds()
    return !enabledChainIds.includes(chainId)
  }, [chainId])

  const handleNetworkSwitch = async (networkChainId: string) => {
    if (!isConnected) return

    // Don't do anything if already on the target network
    if (chainId === networkChainId) return

    try {
      await switchNetwork(networkChainId)
    } catch (error: any) {
      console.error("Failed to switch Starknet network:", error)

      // Show user-friendly message for unsupported operation
      if (
        error.message?.includes("Unsupported") ||
        error.message?.includes("wallet_switchStarknetChain")
      ) {
        toast({
          title: "Manual Network Switch Required",
          description:
            "Please switch networks manually in your Starknet wallet",
          status: "info",
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: "Network Switch Failed",
          description: error.message || "Failed to switch network",
          status: "error",
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  // Only show if Starknet wallet is connected AND no EVM wallet is connected
  if (!isConnected || evmAccount) return null

  // Show warning if no networks are enabled
  if (STARKNET_NETWORKS.length === 0) {
    return (
      <Text
        fontSize="sm"
        color="red.500"
        px={4}
        py={2}
        bg={useColorModeValue("red.50", "red.900")}
        borderRadius="md"
      >
        No Starknet networks enabled
      </Text>
    )
  }

  // Show warning if on disabled network
  if (isOnDisabledNetwork) {
    return (
      <Button
        variant="outline"
        size="md"
        colorScheme="red"
        onClick={() => {
          const firstEnabledNetwork = STARKNET_NETWORKS[0]
          if (firstEnabledNetwork) {
            handleNetworkSwitch(firstEnabledNetwork.chainId)
          }
        }}
        leftIcon={
          <Icon viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </Icon>
        }
      >
        Network Disabled - Click to Switch
      </Button>
    )
  }

  return (
    <>
      {/* Mobile */}
      <Menu placement="bottom-end">
        {({ isOpen }) => (
          <>
            <MenuButton
              as={IconButton}
              variant="unstyled"
              display={{ base: "inherit", md: "none" }}
              _hover={{ bg: hoverBg }}
              _active={{ bg: hoverBg }}
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              aria-label="Select Starknet Network"
              size="md"
            />
            <MenuList zIndex="dropdown" minW="0">
              {renderMenuItems(handleNetworkSwitch, chainId)}
            </MenuList>
          </>
        )}
      </Menu>

      {/* Desktop */}
      <Menu placement="bottom-end">
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              variant="outline"
              display={{ base: "none", md: "inherit" }}
              bg={buttonBg}
              _hover={{ bg: hoverBg }}
              _active={{ bg: hoverBg }}
              size="md"
            >
              {currentNetwork?.name || "Unknown Network"}
            </MenuButton>
            <MenuList zIndex="dropdown" minW="0">
              {renderMenuItems(handleNetworkSwitch, chainId)}
            </MenuList>
          </>
        )}
      </Menu>
    </>
  )
}

const renderMenuItems = (
  onSwitch: (chainId: string) => void,
  currentChainId: string | null
) =>
  STARKNET_NETWORKS.map((network) => (
    <MenuItem
      key={network.chainId}
      onClick={() => onSwitch(network.chainId)}
      iconSpacing="4"
      display="flex"
      gap="3"
      fontWeight={network.chainId === currentChainId ? "bold" : "normal"}
      bg={network.chainId === currentChainId ? "gray.100" : undefined}
      _hover={{
        bg: network.chainId === currentChainId ? "gray.200" : "gray.50",
      }}
    >
      {network.name}
      {network.chainId === currentChainId && " ✓"}
    </MenuItem>
  ))

export default StarknetNetworkButton
