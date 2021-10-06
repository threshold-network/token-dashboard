type NetworkMap = {
  [chainId: number]: string
}

const networkMap: NetworkMap = {
  1: "Ethereum",
  3: "Ropsten",
  4: "Rinkeby",
  5: "Goerli",
  42: "Kovan",
}

const chainIdToNetworkName = (chainId = 1): string => {
  const network = networkMap[chainId]
  return network || "Unsupported Network"
}

export default chainIdToNetworkName
