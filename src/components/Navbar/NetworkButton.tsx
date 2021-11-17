import { FC, ReactElement, useMemo } from "react"
import { Button, Icon, IconButton, useColorMode } from "@chakra-ui/react"
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
    () => (colorMode === "light" ? EthereumLight : EthereumDark),
    [colorMode]
  )
  const iconColor = useMemo(
    () => (colorMode === "light" ? "white" : "gray.800"),
    [colorMode]
  )

  const networkIconMap: NetworkIconMap = {
    [ChainID.Ethereum]: {
      icon: <Icon as={ethereumLogo} />,
      bg: "blue.500",
    },
    [ChainID.Ropsten]: {
      icon: <Icon as={MdOutlineTrain} color={iconColor} />,
      bg: "yellow.500",
    },
  }

  const networkIcon = useMemo(
    () =>
      networkIconMap[chainId || 0] || {
        icon: <Icon as={BsQuestionCircleFill} color={iconColor} />,
        bg: "red.500",
      },
    [chainId]
  )

  return (
    <>
      {/* Mobile */}
      <IconButton
        as={Button}
        _hover={{
          bg: networkIcon.bg,
        }}
        display={{
          base: "inherit",
          sm: "none",
        }}
        _active={{
          bg: networkIcon.bg,
        }}
        bg={networkIcon.bg}
        icon={networkIcon.icon}
        aria-label="network"
      />

      {/* Desktop */}
      <Button
        leftIcon={networkIcon.icon}
        display={{ base: "none", sm: "inherit" }}
      >
        {chainIdToNetworkName(chainId)}
      </Button>
    </>
  )
}

export default NetworkButton
