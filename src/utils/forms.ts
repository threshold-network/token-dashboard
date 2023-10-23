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

export const defaultStakingLessThanMessage: (maxAmount: string) => string = (
  maxAmount
) => {
  return `The maximum stake amount is ${formatTokenAmount(maxAmount)}.`
}

export const defaultStakingGreaterThanMessage: (minAmount: string) => string = (
  minAmount
) => {
  return `The minimum stake amount is ${formatTokenAmount(minAmount)}.`
}
export const defaultAmountValidationOptions: AmountValidationOptions = {
  greaterThanValidationMessage: defaultStakingGreaterThanMessage,
  lessThanValidationMessage: defaultStakingLessThanMessage,
  requiredMessage: "The stake amount is required.",
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
  const isValueMissing = !value
  if (isValueMissing) {
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
