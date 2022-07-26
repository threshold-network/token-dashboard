import { ChainID } from "../enums"

type NetworkMap = {
  [chainId: number]: string
}

const networkMap: NetworkMap = {
  [ChainID.Ethereum]: "Ethereum",
  // [ChainID.Ropsten]: "Ropsten Test",
  // 4: "Rinkeby",
  [ChainID.Goerli]: "Goerli Test",
  // 42: "Kovan",
  [ChainID.Localhost]: "Localhost",
}

const chainIdToNetworkName = (chainId: string | number = 1): string => {
  const network = networkMap[Number(chainId)]
  return network || "Unsupported"
}

export default chainIdToNetworkName
