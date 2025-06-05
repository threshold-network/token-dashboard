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
  if (!address) return false

  // Basic validation for StarkNet address format
  if (!address.startsWith("0x") && !address.startsWith("0X")) return false

  // Remove 0x prefix and check if it's a valid hex string
  const hexPart = address.slice(2)
  if (!/^[0-9a-fA-F]+$/.test(hexPart)) return false

  // StarkNet addresses can be up to 64 characters (32 bytes) but typically shorter
  if (hexPart.length === 0 || hexPart.length > 64) return false

  return true
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
