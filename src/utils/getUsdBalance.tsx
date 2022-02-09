import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { formatFiatCurrencyAmount } from "./formatAmount"

const getUsdBalance = (
  balance: string | number,
  usdConversion: number
): string => {
  return formatFiatCurrencyAmount(
    toUsdBalance(formatUnits(balance), usdConversion).toString()
  )
}

export const toUsdBalance = (
  balance: string | number,
  usdConversion: number
): FixedNumber => {
  return FixedNumber.fromString(usdConversion.toString()).mulUnsafe(
    FixedNumber.fromString(balance.toString())
  )
}

export default getUsdBalance
