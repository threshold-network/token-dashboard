import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"

export const formatNumeral = (number: string | number, format = "0,00.00") => {
  return numeral(number).format(format, Math.floor)
}

export const formatTokenAmount = (
  rawAmount: number | string,
  format = "0,00.[0]0",
  decimals = 18
) => {
  return formatNumeral(formatUnits(rawAmount, decimals), format)
}

export const formatFiatCurrencyAmount = (
  amount: number | string,
  format = "0,00",
  currencySymbol = "$"
) => {
  return formatNumeral(amount, `${currencySymbol}${format}`)
}

export const formatSatoshi = (amount: number | string, precision = 2) => {
  let precisionFormat = ""
  if (precision > 0) {
    precisionFormat = `[0]${"0".repeat(precision - 1)}`
  }
  const format = `0,00.${precisionFormat}`

  return formatTokenAmount(amount, format, 8)
}
