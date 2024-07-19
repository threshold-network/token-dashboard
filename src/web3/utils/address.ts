import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"
export { unprefixedAndUncheckedAddress } from "../../threshold-ts/utils"

export const getAddress = (address: string) => ethersGetAddress(address)

export const isAddress = (address: string): boolean => ethersIsAddress(address)

export const isSameETHAddress = (
  address1: string,
  address2: string
): boolean => {
  // TODO: this has the potential to cause an app crash if the addresses passed are not valid ETH addresses
  return getAddress(address1) === getAddress(address2)
}

export const isSameChainId = (
  chainId1: number | string,
  chainId2: number
): boolean => {
  const chainId1Str = chainId1.toString()
  const chainId2Str = chainId2.toString()
  return chainId1Str === chainId2Str || chainId1Str === `0x${chainId2Str}`
}

export const isAddressZero = (address: string): boolean =>
  isSameETHAddress(address, AddressZero)

export const isEmptyOrZeroAddress = (address: string): boolean => {
  return !isAddress(address) || isAddressZero(address)
}

export { AddressZero }
