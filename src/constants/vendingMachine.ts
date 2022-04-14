import { BigNumber } from "@ethersproject/bignumber"

const STANDARD_ERC20_DECIMALS = 18
export const WRAPPED_TOKEN_CONVERSION_PRECISION = 3
export const FLOATING_POINT_DIVISOR = BigNumber.from(10).pow(
  BigNumber.from(STANDARD_ERC20_DECIMALS - WRAPPED_TOKEN_CONVERSION_PRECISION)
)
