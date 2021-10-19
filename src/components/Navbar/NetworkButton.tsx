import { FC, ReactElement, useMemo } from "react"
import { Button, Icon, IconButton } from "@chakra-ui/react"
import { BsQuestionCircleFill, MdOutlineTrain } from "react-icons/all"
import { ChainID } from "../../enums"
import { Ethereum } from "../../static/icons/Ethereum"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"

interface NetworkIconMap {
  [chainId: number]: { icon: ReactElement; bg: string }
}

const networkIconMap: NetworkIconMap = {
  [ChainID.Ethereum]: {
    icon: <Icon as={Ethereum} />,
    bg: "blue.500",
  },
  [ChainID.Ropsten]: {
    icon: <Icon as={MdOutlineTrain} color="white" />,
    bg: "yellow.500",
  },
}

const NetworkButton: FC<{ chainId?: number }> = ({ chainId }) => {
  const networkIcon = useMemo(
    () =>
      networkIconMap[chainId || 0] || {
        icon: <Icon as={BsQuestionCircleFill} color="white" />,
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
          base: "block",
          md: "none",
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
        display={{ base: "none", md: "block" }}
      >
        {chainIdToNetworkName(chainId)}
      </Button>
    </>
  )
}

export default NetworkButton
