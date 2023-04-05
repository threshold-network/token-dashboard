import { TransactionHash } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import {
  AddressType,
  getAddressInfo,
  Network,
  validate,
} from "bitcoin-address-validation"

export const isValidBtcAddress = (
  address: string,
  network: Network = Network.mainnet
): boolean => {
  return validate(address, network)
}

export const isPublicKeyHashTypeAddress = (address: string): boolean => {
  const { type } = getAddressInfo(address)
  return type === AddressType.p2pkh || type === AddressType.p2wpkh
}

/**
 * The hash is supposed to have the same byte order as used by the Bitcoin block
 * explorers which is the opposite of the byte order used by the Bitcoin
 * protocol internally. That means the hash must be reversed in the use cases
 * that expect the Bitcoin internal byte order. An example use case is the
 * Bitcoin transaction hash is stored on Ethereum in native Bitcoin
 * little-endian format but to get the confirmations for this transaction we
 * need to reverse its hash.
 * @param {string} txHash Transacion hash as string.
 * @return {TransactionHash} Reversed transaction hash.
 */
export const reverseTxHash = (txHash: string): TransactionHash => {
  return TransactionHash.from(txHash).reverse()
}
