import { ChainID } from "../enums"

type NetworkMap = {
  [chainId: number]: string
}

const networkMap: NetworkMap = {
  [ChainID.Ethereum]: "Ethereum",
  [ChainID.Ropsten]: "Ropsten Test",
  // 4: "Rinkeby",
  // 5: "Goerli",
  // 42: "Kovan",
  [ChainID.Localhost]: "Localhost",
}

const chainIdToNetworkName = (chainId = 1): string => {
  const network = networkMap[chainId]
  return network || "Unsupported"
}

export default chainIdToNetworkName
