import { ChainID } from "../enums"

const supportedChainIds = [ChainID.Ethereum, ChainID.Ropsten, ChainID.Localhost]

const isSupportedNetwork = (network?: number) => {
  return network && supportedChainIds.includes(network)
}

export default isSupportedNetwork
