import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "ethers"
import numeral from "numeral"

export const formatNumeral = (number: string | number, format = "0,00.00") => {
  return numeral(number).format(format)
}

export const formatTokenAmount = (
  rawAmount: number | string,
  format = "0,00.[0]0",
  decimals = 18,
  precision = 2,
  displayTildeBelow = 1
) => {
  const minAmountToDisplay = BigNumber.from(10).pow(decimals - precision)
  const _rawAmount = BigNumber.from(rawAmount)

  if (_rawAmount.isZero()) return "0"

  if (minAmountToDisplay.gt(_rawAmount)) {
    return `<0.${"0".repeat(precision - 1)}1`
  }

  let _format
  if (precision && precision > 0) {
    const precisionFormat = `[0]${"0".repeat(precision - 1)}`
    _format = `0,00.${precisionFormat}`
  } else {
    _format = format
  }

  const tokenAmountInHumanReadableFormat = formatUnits(rawAmount, decimals)
  const formattedAmount = formatNumeral(
    tokenAmountInHumanReadableFormat,
    _format
  )

  const amountFromFormattedValue = numeral(formattedAmount).value() ?? 0

  if (
    Number.parseFloat(amountFromFormattedValue.toString()) !==
      Number.parseFloat(tokenAmountInHumanReadableFormat) &&
    displayTildeBelow > amountFromFormattedValue
  ) {
    return `~${formattedAmount}`
  }

  return formattedAmount
}

export const formatFiatCurrencyAmount = (
  amount: number | string,
  format = "0,00",
  currencySymbol = "$"
) => {
  return formatNumeral(amount, `${currencySymbol}${format}`)
}

export const formatSatoshi = (amount: number | string, precision = 2) => {
  return formatTokenAmount(amount, undefined, 8, precision)
}
