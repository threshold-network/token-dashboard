import { EthereumAddress } from "@keep-network/tbtc-v2.ts"
import { Network, validate } from "bitcoin-address-validation"

export const isValidBtcAddress = (
  address: string,
  network: Network = Network.mainnet
): boolean => {
  return validate(address, network)
}

export const getChainIdentifier = (ethAddress: string): EthereumAddress => {
  return EthereumAddress.from(ethAddress)
}
