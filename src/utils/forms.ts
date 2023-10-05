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

type ValidationMsg = string | ((amount: string) => string)
type ValidationOptions = {
  greaterThanValidationMsg: ValidationMsg
  lessThanValidationMsg: ValidationMsg
  requiredMsg: string
  insufficientBalanceMsg: string
}
export const DEFAULT_MIN_VALUE = WeiPerEther.toString()

export const defaultLessThanMsg: (maxAmount: string) => string = (
  maxAmount
) => {
  return `The maximum stake amount is ${formatTokenAmount(maxAmount)}.`
}

export const defaultGreaterThanMsg: (minAmount: string) => string = (
  minAmount
) => {
  return `The minimum stake amount is ${formatTokenAmount(minAmount)}.`
}
export const defaultValidationOptions: ValidationOptions = {
  greaterThanValidationMsg: defaultGreaterThanMsg,
  lessThanValidationMsg: defaultLessThanMsg,
  requiredMsg: "The stake amount is required.",
  insufficientBalanceMsg: "Your wallet balance is insufficient.",
}

export const validateAmountInRange = (
  value: string,
  maxValue: string,
  minValue = DEFAULT_MIN_VALUE,
  options: ValidationOptions = defaultValidationOptions
) => {
  const isValueMissing = !value
  if (isValueMissing) {
    return options.requiredMsg
  }

  const valueInBN = BigNumber.from(value)
  const maxValueInBN = BigNumber.from(maxValue)
  const minValueInBN = BigNumber.from(minValue)

  const isBalanceInsufficient = maxValueInBN.isZero()
  const isMaximumValueExceeded = valueInBN.gt(maxValueInBN)
  const isMinimumValueFulfilled = valueInBN.gte(minValueInBN)

  if (isMinimumValueFulfilled && isBalanceInsufficient) {
    return options.insufficientBalanceMsg
  }
  if (!isBalanceInsufficient && isMaximumValueExceeded) {
    return typeof options.lessThanValidationMsg === "function"
      ? options.lessThanValidationMsg(maxValue)
      : options.lessThanValidationMsg
  }
  if (!isMinimumValueFulfilled) {
    return typeof options.greaterThanValidationMsg === "function"
      ? options.greaterThanValidationMsg(minValue)
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
