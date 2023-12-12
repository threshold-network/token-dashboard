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

type AmountValidationMessage = string | ((amount: string) => string)
type AmountValidationOptions = {
  greaterThanValidationMessage: AmountValidationMessage
  lessThanValidationMessage: AmountValidationMessage
  requiredMessage: string
  insufficientBalanceMessage: string
}
export const DEFAULT_MIN_VALUE = WeiPerEther.toString()

export const defaultLessThanMessage: (maxAmount: string) => string = (
  maxAmount
) => {
  return `The value should be less than or equal ${formatTokenAmount(
    maxAmount
  )}`
}

export const defaultGreaterThanMessage: (minAmount: string) => string = (
  minAmount
) => {
  return `The value should be greater than or equal ${formatTokenAmount(
    minAmount
  )}`
}
export const defaultAmountValidationOptions: AmountValidationOptions = {
  greaterThanValidationMessage: defaultGreaterThanMessage,
  lessThanValidationMessage: defaultLessThanMessage,
  requiredMessage: "Required.",
  insufficientBalanceMessage: "Your wallet balance is insufficient.",
}

const getAmountInRangeValidationMessage = (
  validationMessage: AmountValidationMessage,
  value: string
) => {
  return typeof validationMessage === "function"
    ? validationMessage(value)
    : validationMessage
}

export const validateAmountInRange = (
  value: string,
  maxValue: string,
  minValue = DEFAULT_MIN_VALUE,
  options: AmountValidationOptions = defaultAmountValidationOptions
) => {
  if (!value) {
    return options.requiredMessage
  }

  const valueInBN = BigNumber.from(value)
  const maxValueInBN = BigNumber.from(maxValue)
  const minValueInBN = BigNumber.from(minValue)

  const isBalanceInsufficient = maxValueInBN.isZero()
  const isMaximumValueExceeded = valueInBN.gt(maxValueInBN)
  const isMinimumValueFulfilled = valueInBN.gte(minValueInBN)

  if (!isMinimumValueFulfilled) {
    return getAmountInRangeValidationMessage(
      options.greaterThanValidationMessage,
      minValue
    )
  }
  if (isBalanceInsufficient) {
    return options.insufficientBalanceMessage
  }

  if (isMaximumValueExceeded) {
    return getAmountInRangeValidationMessage(
      options.lessThanValidationMessage,
      maxValue
    )
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
    !isPublicKeyHashTypeAddress(address, network)
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
    (!isPublicKeyHashTypeAddress(address, network) &&
      !isPayToScriptHashTypeAddress(address, network))
  ) {
    return `The BTC address has to start with ${getBridgeBTCSupportedAddressPrefixesText(
      "unmint",
      network
    )}, meaning it is P2PKH, P2WPKH, P2SH or P2WSH compliant.`
  }
}
