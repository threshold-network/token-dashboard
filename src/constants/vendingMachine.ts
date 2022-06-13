import { BigNumber } from "@ethersproject/bignumber"
import { STANDARD_ERC20_DECIMALS } from "./web3"

export const WRAPPED_TOKEN_CONVERSION_PRECISION = 3
export const FLOATING_POINT_DIVISOR = BigNumber.from(10).pow(
  BigNumber.from(STANDARD_ERC20_DECIMALS - WRAPPED_TOKEN_CONVERSION_PRECISION)
)
