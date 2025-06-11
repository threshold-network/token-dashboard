import { FC } from "react"
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  useColorModeValue,
  HStack,
  Tooltip,
} from "@chakra-ui/react"
import { BiPowerOff } from "react-icons/bi"
import { useStarknetConnection } from "../hooks/useStarknetConnection"
import { StarknetIcon } from "../static/icons/Starknet"
import { ArgentIcon } from "../static/icons/Argent"
import shortenAddress from "../utils/shortenAddress"
import CopyToClipboard from "./CopyToClipboard"

const StarknetWalletStatus: FC = () => {
  const { isConnected, address, walletName, disconnect, chainId } =
    useStarknetConnection()

  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
  const textColor = useColorModeValue("gray.700", "gray.200")
  const disconnectHoverBg = useColorModeValue("red.50", "red.900")

  // Don't render if not connected
  if (!isConnected || !address) {
    return null
  }

  // Choose icon based on wallet name
  const WalletIcon = walletName?.toLowerCase().includes("argent")
    ? ArgentIcon
    : StarknetIcon

  // Display network name based on chain ID
  const networkName =
    chainId === "0x534e5f4d41494e"
      ? "Mainnet"
      : chainId === "0x534e5f5345504f4c4941"
      ? "Testnet"
      : "Unknown"

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow="sm"
      mb={4}
    >
      <Flex align="center" justify="space-between">
        <HStack spacing={3}>
          {/* Wallet Icon */}
          <Box>
            <WalletIcon width="32" height="32" />
          </Box>

          {/* Wallet Info */}
          <Box>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              {walletName || "Starknet Wallet"}
            </Text>
            <HStack spacing={2} align="center">
              <CopyToClipboard
                textToCopy={address}
                helperText="Copy Starknet address"
                copyButtonPosition="end"
              >
                <Text fontSize="xs" color="gray.500">
                  {shortenAddress(address)}
                </Text>
              </CopyToClipboard>
            </HStack>
            <Text fontSize="xs" color="gray.400" mt={1}>
              {networkName}
            </Text>
          </Box>
        </HStack>

        {/* Disconnect Button */}
        <Tooltip label="Disconnect wallet" placement="top">
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={disconnect}
            _hover={{ bg: disconnectHoverBg }}
            aria-label="Disconnect Starknet wallet"
          >
            <Icon as={BiPowerOff} boxSize={4} />
          </Button>
        </Tooltip>
      </Flex>
    </Box>
  )
}

export default StarknetWalletStatus
