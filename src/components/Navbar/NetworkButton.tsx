import { FC, ReactElement, useMemo } from "react"
import {
  Button,
  Icon,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { BsQuestionCircleFill, MdOutlineTrain } from "react-icons/all"
import { ChainID } from "../../enums"
import { EthereumLight } from "../../static/icons/EthereumLight"
import { EthereumDark } from "../../static/icons/EthereumDark"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"

interface NetworkIconMap {
  [chainId: number]: { icon: ReactElement; bg: string }
}

const NetworkButton: FC<{ chainId?: number }> = ({ chainId }) => {
  const { colorMode } = useColorMode()
  const ethereumLogo = useMemo(
    () => (colorMode === "light" ? EthereumDark : EthereumLight),
    [colorMode]
  )

  const networkIconMap: NetworkIconMap = {
    [ChainID.Ethereum]: {
      icon: <Icon as={ethereumLogo} />,
      bg: "gray.700",
    },
    [ChainID.Ropsten]: {
      icon: (
        <Icon
          as={MdOutlineTrain}
          color={useColorModeValue("yellow.500", "white")}
        />
      ),
      bg: "yellow.500",
    },
  }

  const networkIcon = networkIconMap[chainId || 0] || {
    icon: (
      <Icon
        as={BsQuestionCircleFill}
        color={useColorModeValue("red.500", "white")}
      />
    ),
    bg: "red.500",
  }

  return (
    <>
      {/* Mobile */}
      <IconButton
        variant="unstyled"
        as={Button}
        display={{
          base: "inherit",
          sm: "none",
        }}
        _hover={{
          bg: useColorModeValue("transparent", networkIcon.bg),
        }}
        _active={{
          bg: useColorModeValue("transparent", networkIcon.bg),
        }}
        bg={useColorModeValue("transparent", networkIcon.bg)}
        border="1px solid"
        borderColor={useColorModeValue("gray.300", "transparent")}
        icon={networkIcon.icon}
        aria-label="network"
      />

      {/* Desktop */}
      <Button
        variant="outline"
        _hover={{
          bg: "transparent",
        }}
        _active={{
          bg: "transparent",
        }}
        leftIcon={networkIcon.icon}
        display={{ base: "none", sm: "inherit" }}
      >
        {chainIdToNetworkName(chainId)}
      </Button>
    </>
  )
}

export default NetworkButton
