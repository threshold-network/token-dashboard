import { BigNumberish } from "ethers"
import { defaultAbiCoder } from "ethers/lib/utils"
import { BITCOIN_PRECISION } from "./bitcoin"
import { to1ePrecision } from "./math"

export const isValidType = (paramType: string, value: string) => {
  try {
    defaultAbiCoder.encode([paramType], [value])
    return true
  } catch (error) {
    return false
  }
}

export const fromSatoshiToTokenPrecision = (
  value: BigNumberish,
  tokenPrecision: number = 18
) => {
  return to1ePrecision(value, tokenPrecision - BITCOIN_PRECISION)
}
