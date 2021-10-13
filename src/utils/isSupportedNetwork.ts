import { ChainID } from "../enums"

const supportedChainIds = [ChainID.Ethereum, ChainID.Ropsten]

const isSupportedNetwork = (network?: number) => {
  return network && supportedChainIds.includes(network)
}

export default isSupportedNetwork
