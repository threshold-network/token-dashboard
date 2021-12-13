import { WeiPerEther } from "@ethersproject/constants"
import { useTConvertedAmount } from "./useTConvertedAmount"
import { UpgredableToken } from "../types"

export const useTExchangeRate = (token: UpgredableToken) => {
  return useTConvertedAmount(token, WeiPerEther.toString())
}
