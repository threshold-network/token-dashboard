import { FixedNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import { formatFiatCurrencyAmount } from "./formatAmount"
import { safeFormatUnits, safeBigNumber } from "./safeBigNumber"

const getUsdBalance = (
  balance: string | number,
  usdConversion: number
): string => {
  try {
    // Handle empty or invalid balance
    if (!balance || balance === "" || balance === "0") {
      return formatFiatCurrencyAmount("0")
    }

    const formattedBalance =
      typeof balance === "string" && balance.includes(".")
        ? balance // Already formatted
        : safeFormatUnits(balance)

    return formatFiatCurrencyAmount(
      toUsdBalance(formattedBalance, usdConversion).toString()
    )
  } catch (error) {
    console.warn("Failed to get USD balance:", error)
    return formatFiatCurrencyAmount("0")
  }
}

export const toUsdBalance = (
  balance: string | number,
  usdConversion: number
): FixedNumber => {
  try {
    // Handle empty or invalid values
    const balanceStr = balance ? balance.toString() : "0"
    const conversionStr = usdConversion ? usdConversion.toString() : "0"

    if (
      !balanceStr ||
      balanceStr === "" ||
      !conversionStr ||
      conversionStr === ""
    ) {
      return FixedNumber.from("0")
    }

    return FixedNumber.fromString(conversionStr).mulUnsafe(
      FixedNumber.fromString(balanceStr)
    )
  } catch (error) {
    console.warn("Failed to calculate USD balance:", error)
    return FixedNumber.from("0")
  }
}

export default getUsdBalance
