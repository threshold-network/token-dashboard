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
} from "@chakra-ui/react"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { useStarknetConnection } from "../../hooks/useStarknetConnection"
import { useStarknetWallet } from "../../contexts/StarknetWalletProvider"
import {
  STARKNET_MAINNET_CHAIN_ID,
  STARKNET_SEPOLIA_CHAIN_ID,
} from "../../types/starknet"
import { useIsActive } from "../../hooks/useIsActive"

interface StarkNetNetwork {
  chainId: string
  name: string
  isTestnet: boolean
}

const STARKNET_NETWORKS: StarkNetNetwork[] = [
  {
    chainId: STARKNET_MAINNET_CHAIN_ID,
    name: "StarkNet Mainnet",
    isTestnet: false,
  },
  {
    chainId: STARKNET_SEPOLIA_CHAIN_ID,
    name: "StarkNet Sepolia",
    isTestnet: true,
  },
]

const StarkNetNetworkButton: FC = () => {
  const { colorMode } = useColorMode()
  const { chainId, isConnected } = useStarknetConnection()
  const { switchNetwork } = useStarknetWallet()
  const { account: evmAccount } = useIsActive()
  const toast = useToast()

  // All hooks must be called before any conditional returns
  const buttonBg = useColorModeValue("gray.100", "gray.700")
  const hoverBg = useColorModeValue("gray.200", "gray.600")

  const currentNetwork = useMemo(() => {
    return (
      STARKNET_NETWORKS.find((network) => network.chainId === chainId) ||
      STARKNET_NETWORKS[1]
    ) // Default to Sepolia
  }, [chainId])

  const handleNetworkSwitch = async (networkChainId: string) => {
    if (!isConnected) return

    // Don't do anything if already on the target network
    if (chainId === networkChainId) return

    try {
      await switchNetwork(networkChainId)
    } catch (error: any) {
      console.error("Failed to switch StarkNet network:", error)

      // Show user-friendly message for unsupported operation
      if (
        error.message?.includes("Unsupported") ||
        error.message?.includes("wallet_switchStarknetChain")
      ) {
        toast({
          title: "Manual Network Switch Required",
          description:
            "Please switch networks manually in your StarkNet wallet",
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

  // Only show if StarkNet wallet is connected AND no EVM wallet is connected
  if (!isConnected || evmAccount) return null

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
              aria-label="Select StarkNet Network"
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
              size="sm"
            >
              {currentNetwork.name}
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

export default StarkNetNetworkButton
