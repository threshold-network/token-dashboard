import { Button, Circle, Icon } from "@chakra-ui/react"
import { FC, ReactElement } from "react"
import { Ethereum } from "../../static/icons/Ethereum"
import chainIdToNetworkName from "../../utils/chainIdToNetworkName"
import { ChainID } from "../../types"
import { BsQuestionCircleFill } from "react-icons/all"

interface NetworkButtonProps {
  chainId?: number
}

interface NetworkIconMap {
  [chainId: number]: ReactElement
}

const networkIconMap: NetworkIconMap = {
  [ChainID.Ethereum]: <Ethereum />,
  [ChainID.Ropsten]: <Circle size="12px" bg="green.500" />,
}

const NetworkButton: FC<NetworkButtonProps> = ({ chainId }) => {
  if (!chainId) {
    return null
  }

  return (
    <Button
      variant="secondary"
      leftIcon={
        networkIconMap[chainId] || (
          <Icon as={BsQuestionCircleFill} color="red.600" h="12px" w="12px" />
        )
      }
    >
      {chainIdToNetworkName(chainId)}
    </Button>
  )
}

export default NetworkButton
