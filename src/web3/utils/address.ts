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

export const isAddressZero = (address: string): boolean =>
  isSameETHAddress(address, AddressZero)

export const isEmptyOrZeroAddress = (address: string): boolean => {
  return !isAddress(address) || isAddressZero(address)
}

export { AddressZero }
