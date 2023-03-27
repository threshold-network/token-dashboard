const ETHERSCAN_PREFIXES: { [chainId: number]: string } = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
}

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

export const createBlockExplorerLink = (
  prefix: string,
  id: string,
  type: ExplorerDataType
) => {
  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${id}`
    }
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${id}`
    }
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${id}`
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${id}`
    }
  }
}

const createEtherscanLink = (
  chainId: number,
  address: string,
  type: ExplorerDataType
): string => {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ""}etherscan.io`

  return createBlockExplorerLink(prefix, address, type)
}

export default createEtherscanLink
