import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"
export { unprefixedAndUncheckedAddress } from "../../threshold-ts/utils"

// The StarkNet prime is 2^251 + 17 * 2^192 + 1.
// It's a 252-bit number.
const SN_STARK_PRIME = BigInt(
  "0x800000000000011000000000000000000000000000000000000000000000001"
)

export const getAddress = (address: string) => ethersGetAddress(address)

export const isEthereumAddress = (address: string): boolean => {
  try {
    return ethersIsAddress(address)
  } catch {
    return false
  }
}

export const isStarknetAddress = (address: string): boolean => {
  if (!address) return false
  try {
    const value = BigInt(address)
    // A StarkNet address is a felt252, so it must be in the range [0, SN_STARK_PRIME).
    return value >= BigInt(0) && value < SN_STARK_PRIME
  } catch {
    return false
  }
}

export const isAddress = (address: string): boolean => {
  // Check both Ethereum (40 hex) and Starknet formats
  return isEthereumAddress(address) || isStarknetAddress(address)
}

export const isSameETHAddress = (
  address1: string,
  address2: string
): boolean => {
  // TODO: this has the potential to cause an app crash if the addresses passed are not valid ETH addresses
  try {
    return getAddress(address1) === getAddress(address2)
  } catch {
    // If either address is invalid, they can't be the same
    return false
  }
}

export const isSameAddress = (address1: string, address2: string): boolean => {
  // Handle both Ethereum and Starknet addresses
  if (isEthereumAddress(address1) && isEthereumAddress(address2)) {
    return getAddress(address1) === getAddress(address2)
  }

  if (isStarknetAddress(address1) && isStarknetAddress(address2)) {
    // Starknet addresses are case-insensitive.
    // BigInt conversion handles different paddings e.g. 0x0 is same as 0x00
    try {
      return BigInt(address1) === BigInt(address2)
    } catch {
      return false
    }
  }

  // Different address types can't be the same
  return false
}

export const isAddressZero = (address: string): boolean => {
  try {
    // `BigInt(address)` will throw for non-hex strings. `BigInt(AddressZero)` is 0n.
    // This works for both ETH and StarkNet zero addresses.
    return BigInt(address) === BigInt(0)
  } catch {
    return false
  }
}

export const isEmptyOrZeroAddress = (address: string): boolean => {
  if (!address) return true

  return !isAddress(address) || isAddressZero(address)
}

export { AddressZero }
