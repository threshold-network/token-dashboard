import numeral from "numeral"
import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"

const getUsdBalance = (
  balance: string | number,
  usdConversion: number
): string => {
  return numeral(
    FixedNumber.fromString(usdConversion.toString())
      .mulUnsafe(FixedNumber.fromString(formatUnits(balance)))
      .toString()
  ).format("$0,0.00")
}

export default getUsdBalance
