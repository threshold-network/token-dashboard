import { getAddress } from "@ethersproject/address"

export const isSameETHAddress = (
  address1: string,
  address2: string
): boolean => {
  return getAddress(address1) === getAddress(address2)
}
