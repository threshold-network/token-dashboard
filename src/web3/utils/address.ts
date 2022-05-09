import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"

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
