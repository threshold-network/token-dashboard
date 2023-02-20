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
