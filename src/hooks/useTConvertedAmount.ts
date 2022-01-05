import { useMemo } from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"
import { useVendingMachineRatio } from "../web3/hooks/useVendingMachineRatio"
import { UpgredableToken } from "../types"

const WRAPPED_TOKEN_CONVERSION_PRECISION = 3
const STANDARD_ERC20_DECIMALS = 18
const FLOATING_POINT_DIVISOR = BigNumber.from(10).pow(
  BigNumber.from(STANDARD_ERC20_DECIMALS - WRAPPED_TOKEN_CONVERSION_PRECISION)
)

export const useTConvertedAmount = (
  token: UpgredableToken,
  amountToConvert: string | number
) => {
  const ratio = useVendingMachineRatio(token)

  return useMemo(() => {
    if (amountToConvert === "" || !ratio) {
      return {
        amount: "0",
        formattedAmount: "--",
      }
    }

    const wrappedRemainder = BigNumber.from(amountToConvert).mod(
      FLOATING_POINT_DIVISOR
    )
    const convertibleAmount =
      BigNumber.from(amountToConvert).sub(wrappedRemainder)
    const amount = convertibleAmount
      .mul(BigNumber.from(ratio))
      .div(FLOATING_POINT_DIVISOR)
      .toString()

    return {
      amount,
      formattedAmount: numeral(formatUnits(amount)).format("0,0.00"),
    }
  }, [amountToConvert, ratio])
}
