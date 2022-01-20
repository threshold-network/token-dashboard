import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { formatFiatCurrencyAmount } from "./formatAmount"

const getUsdBalance = (
  balance: string | number,
  usdConversion: number
): string => {
  return formatFiatCurrencyAmount(
    FixedNumber.fromString(usdConversion.toString())
      .mulUnsafe(FixedNumber.fromString(formatUnits(balance)))
      .toString()
  )
}

export default getUsdBalance
