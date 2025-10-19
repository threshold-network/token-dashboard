import { formatUnits } from "@ethersproject/units"
import { BigNumber } from "ethers"
import numeral from "numeral"

export const formatNumeral = (number: string | number, format = "0,00.00") => {
  // Check for invalid input
  if (number === null || number === undefined || isNaN(Number(number))) {
    console.warn("Invalid number passed to formatNumeral:", number)
    return "0"
  }

  const result = numeral(number).format(format)

  // If numeral returns NaN, handle it
  if (result === "NaN") {
    console.warn("Numeral returned NaN for:", { number, format })
    return number.toString()
  }

  return result
}

export const formatTokenAmount = (
  rawAmount: number | string,
  format = "0,00.[0]0",
  decimals = 18,
  precision = 2,
  displayTildeBelow = 1
) => {
  // Handle empty or invalid values
  if (!rawAmount || rawAmount === "" || rawAmount === "0") return "0"

  let _rawAmount: BigNumber
  try {
    _rawAmount = BigNumber.from(rawAmount)
  } catch (error) {
    console.warn("Invalid amount for formatting:", rawAmount)
    return "0"
  }

  const minAmountToDisplay = BigNumber.from(10).pow(decimals - precision)

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

  if (isNaN(Number(tokenAmountInHumanReadableFormat))) {
    return "0"
  }

  const formattedAmount = formatNumeral(
    tokenAmountInHumanReadableFormat,
    _format
  )

  // Check if formatNumeral returned NaN
  if (formattedAmount === "NaN" || isNaN(Number(formattedAmount))) {
    // For very small numbers, display them directly
    const num = Number(tokenAmountInHumanReadableFormat)
    if (num > 0) {
      // Use a format that preserves all significant digits
      if (num < 0.000001) {
        // For very small numbers, use toFixed with enough precision
        const fixedNum = num.toFixed(Math.max(8, precision))
        // Remove trailing zeros but keep at least one decimal place
        return fixedNum.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
      }
      return num.toString()
    }
    return "0"
  }

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
