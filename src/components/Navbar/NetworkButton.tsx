import { FC, ReactElement, useMemo } from "react"
import { Button, Icon, IconButton, useColorMode } from "@chakra-ui/react"
import { BsQuestionCircleFill, MdOutlineTrain } from "react-icons/all"
import { ChainID } from "../../enums"
import { EthereumLight } from "../../static/icons/EthereumLight"
import { EthereumDark } from "../../static/icons/EthereumDark"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"

interface NetworkIconMap {
  [chainId: number]: ReactElement
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
    [ChainID.Ethereum]: <Icon as={ethereumLogo} />,
    [ChainID.Ropsten]: <Icon as={MdOutlineTrain} color={iconColor} />,
  }

  const networkIcon = useMemo(
    () =>
      networkIconMap[chainId || 0] || (
        <Icon as={BsQuestionCircleFill} color="white" />
      ),
    [chainId]
  )

  return (
    <>
      {/* Mobile */}
      <IconButton
        as={Button}
        display={{
          base: "inherit",
          md: "none",
        }}
        icon={networkIcon}
        aria-label="network"
        variant="outline"
      />

      {/* Desktop */}
      <Button
        variant="outline"
        leftIcon={networkIcon}
        display={{ base: "none", md: "inherit" }}
      >
        {chainIdToNetworkName(chainId)}
      </Button>
    </>
  )
}

export default NetworkButton
