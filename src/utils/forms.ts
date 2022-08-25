import { BigNumber } from "@ethersproject/bignumber"
import { WeiPerEther } from "@ethersproject/constants"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { isAddress, isAddressZero } from "../web3/utils"
import { formatTokenAmount } from "./formatAmount"

type ValidationMsg = string | ((amount: string) => string)
type ValidationOptions = {
  greaterThanValidationMsg: ValidationMsg
  lessThanValidationMsg: ValidationMsg
  requiredMsg: string
}
export const DEFAULT_MIN_VALUE = WeiPerEther.toString()

const defaultLessThanMsg: ValidationMsg = (minAmount) => {
  return `The value should be less than or equal ${formatTokenAmount(
    minAmount
  )}`
}

const defaultGreaterThanMsg: ValidationMsg = (maxAmount) => {
  return `The value should be greater than or equal ${formatTokenAmount(
    maxAmount
  )}`
}
const defaultValidationOptions: ValidationOptions = {
  greaterThanValidationMsg: defaultGreaterThanMsg,
  lessThanValidationMsg: defaultLessThanMsg,
  requiredMsg: "Required",
}

export const validateAmountInRange = (
  value: string,
  maxValue: string,
  minValue = DEFAULT_MIN_VALUE,
  options: ValidationOptions = defaultValidationOptions
) => {
  if (!value) {
    return options.requiredMsg
  }

  const valueInBN = BigNumber.from(value)
  const maxValueInBN = BigNumber.from(maxValue)
  const minValueInBN = BigNumber.from(minValue)

  if (valueInBN.gt(maxValueInBN)) {
    return typeof options.lessThanValidationMsg === "function"
      ? options.lessThanValidationMsg(maxValue)
      : options.lessThanValidationMsg
  } else if (valueInBN.lt(minValueInBN)) {
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
  network: Network = Network.mainnet
) => {
  if (!address) {
    return "Required."
  } else if (!isValidBtcAddress(address, network)) {
    return "Invalid btc address."
  }
}
