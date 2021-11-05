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

const createEtherscanLink = (
  chainId: number,
  address: string,
  type: ExplorerDataType
): string => {
  const prefix = `https://${ETHERSCAN_PREFIXES[chainId] ?? ""}etherscan.io`

  switch (type) {
    case ExplorerDataType.TRANSACTION: {
      return `${prefix}/tx/${address}`
    }
    case ExplorerDataType.TOKEN: {
      return `${prefix}/token/${address}`
    }
    case ExplorerDataType.BLOCK: {
      return `${prefix}/block/${address}`
    }
    case ExplorerDataType.ADDRESS:
    default: {
      return `${prefix}/address/${address}`
    }
  }
}

export default createEtherscanLink
