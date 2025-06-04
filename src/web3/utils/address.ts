import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"
export { unprefixedAndUncheckedAddress } from "../../threshold-ts/utils"

export const getAddress = (address: string) => ethersGetAddress(address)

export const isEthereumAddress = (address: string): boolean =>
  ethersIsAddress(address)

export const isStarknetAddress = (address: string): boolean => {
  // Starknet addresses are 0x prefixed 64 hex characters (32 bytes)
  // They are case-insensitive
  const starknetAddressRegex = /^0x[a-fA-F0-9]{64}$/
  return starknetAddressRegex.test(address)
}

export const isAddress = (address: string): boolean => {
  // Check both Ethereum (40 hex) and Starknet (64 hex) formats
  return isEthereumAddress(address) || isStarknetAddress(address)
}

export const isSameETHAddress = (
  address1: string,
  address2: string
): boolean => {
  // TODO: this has the potential to cause an app crash if the addresses passed are not valid ETH addresses
  return getAddress(address1) === getAddress(address2)
}

export const isSameAddress = (address1: string, address2: string): boolean => {
  // Handle both Ethereum and Starknet addresses
  if (isEthereumAddress(address1) && isEthereumAddress(address2)) {
    return getAddress(address1) === getAddress(address2)
  }

  if (isStarknetAddress(address1) && isStarknetAddress(address2)) {
    // Starknet addresses are case-insensitive
    return address1.toLowerCase() === address2.toLowerCase()
  }

  // Different address types can't be the same
  return false
}

export const isAddressZero = (address: string): boolean =>
  isSameETHAddress(address, AddressZero)

export const isEmptyOrZeroAddress = (address: string): boolean => {
  return !isAddress(address) || isAddressZero(address)
}

export { AddressZero }
