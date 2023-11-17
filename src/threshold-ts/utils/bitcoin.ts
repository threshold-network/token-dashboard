import {
  BitcoinAddressConverter,
  BitcoinHashUtils,
  BitcoinNetwork,
  BitcoinScriptUtils,
  BitcoinTxHash,
  Hex,
} from "@keep-network/tbtc-v2.ts"
import {
  AddressType,
  getAddressInfo,
  Network,
  validate,
} from "bitcoin-address-validation"

export const BITCOIN_PRECISION = 8

export const isValidBtcAddress = (
  address: string,
  network: BitcoinNetwork = BitcoinNetwork.Mainnet
): boolean => {
  return validate(address, network.valueOf() as Network)
}

// P2PKH, P2WPKH, P2SH, or P2WSH
export const isPublicKeyHashTypeAddress = (
  address: string,
  network: BitcoinNetwork = BitcoinNetwork.Mainnet
): boolean => {
  const outputScript = BitcoinAddressConverter.addressToOutputScript(
    address,
    network
  )
  return (
    BitcoinScriptUtils.isP2PKHScript(outputScript) ||
    BitcoinScriptUtils.isP2WPKHScript(outputScript)
  )
}

export const isPayToScriptHashTypeAddress = (address: string): boolean => {
  const { type } = getAddressInfo(address)
  return type === AddressType.p2sh || type === AddressType.p2wsh
}

/**
 * The hash is supposed to have the same byte order as used by the Bitcoin block
 * explorers which is the opposite of the byte order used by the Bitcoin
 * protocol internally. That means the hash must be reversed in the use cases
 * that expect the Bitcoin internal byte order. An example use case is the
 * Bitcoin transaction hash is stored on Ethereum in native Bitcoin
 * little-endian format but to get the confirmations for this transaction we
 * need to reverse its hash.
 * @param {string} txHash Transaction hash as string.
 * @return {string} Reversed transaction hash.
 */
export const reverseTxHash = (txHash: string): string => {
  return BitcoinTxHash.from(txHash).reverse().toString()
}

export const prependScriptPubKeyByLength = (scriptPubKey: string) => {
  const rawRedeemerOutputScript = Buffer.from(scriptPubKey.toString(), "hex")

  // Prefix the output script bytes buffer with 0x and its own length.
  return `0x${Buffer.concat([
    Buffer.from([rawRedeemerOutputScript.length]),
    rawRedeemerOutputScript,
  ]).toString("hex")}`
}

export const computeHash160 = (text: string) => {
  return BitcoinHashUtils.computeHash160(Hex.from(text))
}

export const createOutputScriptFromAddress = (
  address: string,
  bitcoinNetwork: BitcoinNetwork
) => {
  return BitcoinAddressConverter.addressToOutputScript(address, bitcoinNetwork)
}

export const createAddressFromOutputScript = (
  script: Hex,
  bitcoinNetwork: BitcoinNetwork
) => {
  return BitcoinAddressConverter.outputScriptToAddress(script, bitcoinNetwork)
}
