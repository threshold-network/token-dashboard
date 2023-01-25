import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"
import { EthereumAddress } from "@keep-network/tbtc-v2.ts"

export const unprefixedAndUncheckedAddress = (address: string): string => {
  const prefix = address.substring(0, 2)
  if (prefix === "0x") {
    address = address.slice(2)
  }
  return address.toLowerCase()
}

export const getAddress = (address: string) => ethersGetAddress(address)

export const isAddress = (address: string): boolean => ethersIsAddress(address)

export const isSameETHAddress = (
  address1: string,
  address2: string
): boolean => {
  return getAddress(address1) === getAddress(address2)
}

export const isAddressZero = (address: string): boolean =>
  isSameETHAddress(address, AddressZero)

export { AddressZero }

export const getChainIdentifier = (ethAddress: string): EthereumAddress => {
  return EthereumAddress.from(ethAddress)
}
