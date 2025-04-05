import {
  isAddress as ethersIsAddress,
  getAddress as ethersGetAddress,
} from "@ethersproject/address"
import { AddressZero } from "@ethersproject/constants"

import bs58 from "bs58"

export const getAddress = (address: string) => ethersGetAddress(address)
export const isEthereumAddress = (address: string): boolean =>
  ethersIsAddress(address)

export const normalizeETHAddress = (address: string): string => {
  return getAddress(address)
}

export const isBytes32Address = (address: string): boolean => {
  // 66 characters total: "0x" + 64 hex chars
  return /^0x[0-9A-Fa-f]{64}$/.test(address)
}

export const isSolanaAddress = (address: string): boolean => {
  try {
    const bytes = bs58.decode(address)
    // Typical Solana public keys are 32 bytes:
    return bytes.length === 32
  } catch (err) {
    return false
  }
}

export const isSameAddress = (address1: string, address2: string): boolean => {
  if (isEthereumAddress(address1) && isEthereumAddress(address2)) {
    return normalizeETHAddress(address1) === normalizeETHAddress(address2)
  }

  if (isBytes32Address(address1) && isBytes32Address(address2)) {
    return isSameBytes32Address(address1, address2)
  }

  if (isSolanaAddress(address1) && isSolanaAddress(address2)) {
    return isSameSolanaAddress(address1, address2)
  }

  return false
}

export const isSameSolanaAddress = (addr1: string, addr2: string): boolean => {
  const bytes1 = bs58.decode(addr1)
  const bytes2 = bs58.decode(addr2)
  // Compare their hex-strings:
  return bytes1.toString() === bytes2.toString()
}

export const isSameBytes32Address = (addr1: string, addr2: string): boolean => {
  return addr1.toLowerCase() === addr2.toLowerCase()
}

export const isAddress = (address: string): boolean => {
  return (
    isEthereumAddress(address) ||
    isBytes32Address(address) ||
    isSolanaAddress(address)
  )
}

export const isAddressZero = (address: string): boolean =>
  isSameAddress(address, AddressZero)

export const isEmptyOrZeroAddress = (address: string): boolean => {
  return !isEthereumAddress(address) || isAddressZero(address)
}

export { AddressZero }
