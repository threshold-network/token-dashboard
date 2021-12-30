import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"

export const formatNumeral = (number: string | number, format = "0,00.00") => {
  return numeral(number).format(format)
}

export const formatTokenAmount = (
  rawAmount: number | string,
  format = "0,00.00",
  decimals = 18
) => {
  return numeral(formatUnits(rawAmount, decimals)).format(format)
}

export const formatFiatCurrencyAmount = (
  amount: number | string,
  format = "0,00",
  currencySymbol = "$"
) => {
  return numeral(amount).format(`${currencySymbol}${format}`)
}
