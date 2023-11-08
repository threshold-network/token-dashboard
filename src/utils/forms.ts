import { BigNumber } from "@ethersproject/bignumber"
import { WeiPerEther } from "@ethersproject/constants"
import { BitcoinNetwork } from "../threshold-ts/types"
import {
  isPayToScriptHashTypeAddress,
  isPublicKeyHashTypeAddress,
  isValidBtcAddress,
} from "../threshold-ts/utils"
import { isAddress, isAddressZero } from "../web3/utils"
import { formatTokenAmount } from "./formatAmount"
import { getBridgeBTCSupportedAddressPrefixesText } from "./tBTC"

type ValidationMsg =
  | string
  | ((amount: string, tokenDecimals?: number, precision?: number) => string)
type ValidationOptions = {
  greaterThanValidationMsg: ValidationMsg
  lessThanValidationMsg: ValidationMsg
  requiredMsg: string
}
export const DEFAULT_MIN_VALUE = WeiPerEther.toString()

export const defaultLessThanMsg: (
  minAmount: string,
  tokenDecimals?: number,
  precision?: number
) => string = (minAmount, decimals = 18, precision = 2) => {
  return `The value should be less than or equal ${formatTokenAmount(
    minAmount,
    "0,00.[0]0",
    decimals,
    precision
  )}`
}

export const defaultGreaterThanMsg: (
  minAmount: string,
  tokenDecimals?: number,
  precision?: number
) => string = (maxAmount, decimals = 18, precision = 2) => {
  return `The value should be greater than or equal ${formatTokenAmount(
    maxAmount,
    "0,00.[0]0",
    decimals,
    precision
  )}`
}
export const defaultValidationOptions: ValidationOptions = {
  greaterThanValidationMsg: defaultGreaterThanMsg,
  lessThanValidationMsg: defaultLessThanMsg,
  requiredMsg: "Required",
}

export const validateAmountInRange = (
  value: string,
  maxValue: string,
  minValue = DEFAULT_MIN_VALUE,
  options: ValidationOptions = defaultValidationOptions,
  tokenDecimals: number = 18,
  precision: number = 2
) => {
  if (!value) {
    return options.requiredMsg
  }

  const valueInBN = BigNumber.from(value)
  const maxValueInBN = BigNumber.from(maxValue)
  const minValueInBN = BigNumber.from(minValue)

  if (valueInBN.gt(maxValueInBN)) {
    return typeof options.lessThanValidationMsg === "function"
      ? options.lessThanValidationMsg(maxValue, tokenDecimals, precision)
      : options.lessThanValidationMsg
  } else if (valueInBN.lt(minValueInBN)) {
    return typeof options.greaterThanValidationMsg === "function"
      ? options.greaterThanValidationMsg(minValue, tokenDecimals, precision)
      : options.greaterThanValidationMsg
  }
}

export const getErrorsObj = <T>(errors: { [key in keyof T]: string }) => {
  return (Object.keys(errors) as Array<keyof T>).every((name) => !errors[name])
    ? {}
    : errors
}

export const validateETHAddress = (address: string) => {
  if (!address) {
    return "Required."
  } else if (!isAddress(address)) {
    return "Invalid eth address."
  } else if (isAddressZero(address)) {
    return "Address is a zero address."
  }
}

export const validateBTCAddress = (
  address: string,
  network: BitcoinNetwork = BitcoinNetwork.Mainnet
) => {
  if (!address) {
    return "Required."
  } else if (
    !isValidBtcAddress(address, network) ||
    !isPublicKeyHashTypeAddress(address)
  ) {
    return `The BTC Recovery address has to start with ${getBridgeBTCSupportedAddressPrefixesText(
      "mint",
      network
    )}, meaning it is P2PKH or P2WPKH compliant.`
  }
}

export const validateUnmintBTCAddress = (
  address: string,
  network: BitcoinNetwork = BitcoinNetwork.Mainnet
) => {
  if (!address) {
    return "Required."
  } else if (
    !isValidBtcAddress(address, network) ||
    (!isPublicKeyHashTypeAddress(address) &&
      !isPayToScriptHashTypeAddress(address))
  ) {
    return `The BTC address has to start with ${getBridgeBTCSupportedAddressPrefixesText(
      "unmint",
      network
    )}, meaning it is P2PKH, P2WPKH, P2SH or P2WSH compliant.`
  }
}
