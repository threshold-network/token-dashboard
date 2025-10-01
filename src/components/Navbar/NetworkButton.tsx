import { FC, ReactElement, useMemo } from "react"
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
} from "@chakra-ui/react"
import { BsQuestionCircleFill } from "react-icons/all"
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons"
import { EthereumLight } from "../../static/icons/EthereumLight"
import { EthereumDark } from "../../static/icons/EthereumDark"
import { Arbitrum } from "../../static/icons/Arbitrum"
import { Base } from "../../static/icons/Base"
import {
  getParameterNameFromChainId,
  isMainnetChainId,
  networks,
} from "../../networks/utils"
import { useIsActive } from "../../hooks/useIsActive"
import { NetworkType, SupportedChainIds } from "../../networks/enums/networks"
import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"

interface NetworkIconMap {
  icon: ReactElement
  bg: string
}

const getNetworkIcon = (chainId: number, colorMode: string): NetworkIconMap => {
  const defaultChainId = getEthereumDefaultProviderChainId()
  const ethereumLogo = colorMode === "light" ? EthereumDark : EthereumLight
  const grayBackground = "gray.700"

  const iconMap: Record<number, NetworkIconMap> = {
    ...(isMainnetChainId(defaultChainId)
      ? {
          [SupportedChainIds.Ethereum]: {
            icon: <Icon as={ethereumLogo} boxSize="5" />,
            bg: grayBackground,
          },
          [SupportedChainIds.Base]: {
            icon: <Icon as={Base} />,
            bg: grayBackground,
          },
          [SupportedChainIds.Arbitrum]: {
            icon: <Icon as={Arbitrum} boxSize="5" />,
            bg: grayBackground,
          },
        }
      : {
          [SupportedChainIds.Sepolia]: {
            icon: <Icon as={ethereumLogo} boxSize="5" />,
            bg: grayBackground,
          },
          [SupportedChainIds.ArbitrumSepolia]: {
            icon: <Icon as={Arbitrum} boxSize="5" />,
            bg: grayBackground,
          },
          [SupportedChainIds.BaseSepolia]: {
            icon: <Icon as={Base} boxSize="5" />,
            bg: "blue.500",
          },
        }),
  }

  return (
    iconMap[chainId] || {
      icon: (
        <Icon
          as={BsQuestionCircleFill}
          color={colorMode === "light" ? "red.500" : "white"}
          boxSize="5"
        />
      ),
      bg: "red.500",
    }
  )
}

const NetworkButton: FC = () => {
  const { colorMode } = useColorMode()
  const { chainId, switchNetwork } = useIsActive()
  const defaultChainId = getEthereumDefaultProviderChainId()

  const networkIcon = useMemo(
    () => getNetworkIcon(chainId || 0, colorMode),
    [chainId, colorMode]
  )

  const renderMenuItems = () =>
    networks
      .filter((network) =>
        isMainnetChainId(defaultChainId)
          ? network.networkType === NetworkType.Mainnet
          : network.networkType === NetworkType.Testnet &&
            network.chainParameters.chainName !== "Localhost"
      )
      .map((network) => {
        const { icon } = getNetworkIcon(network.chainId, colorMode)
        return (
          <MenuItem
            key={network.chainId}
            onClick={() => switchNetwork(network.chainId)}
            iconSpacing="4"
            display="flex"
            gap="3"
          >
            {icon}
            {network.chainParameters?.chainName}
          </MenuItem>
        )
      })

  return (
    <>
      {/* Mobile */}
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={IconButton}
              variant="unstyled"
              display={{ base: "inherit", md: "none" }}
              _hover={{ bg: useColorModeValue("transparent", networkIcon.bg) }}
              _active={{ bg: useColorModeValue("transparent", networkIcon.bg) }}
              bg={useColorModeValue("transparent", networkIcon.bg)}
              border="1px solid"
              borderColor={useColorModeValue("gray.300", "transparent")}
              icon={
                <>
                  {networkIcon.icon}
                  {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </>
              }
              aria-label="network"
            />
            <MenuList zIndex={20}>{renderMenuItems()}</MenuList>
          </>
        )}
      </Menu>

      {/* Desktop */}
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              variant="outline"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              leftIcon={networkIcon.icon}
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              display={{ base: "none", md: "inherit" }}
            >
              {getParameterNameFromChainId(chainId)}
            </MenuButton>
            <MenuList zIndex={20}>{renderMenuItems()}</MenuList>
          </>
        )}
      </Menu>
    </>
  )
}

export default NetworkButton
