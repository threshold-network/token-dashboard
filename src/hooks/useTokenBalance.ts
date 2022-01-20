import { useMemo } from "react"
import { Token } from "../enums/token"
import { useTokenState } from "./useTokenState"

export const useTokenBalance = (token: Token) => {
  const tokenMap = {
    [Token.T]: "t",
    [Token.Nu]: "nu",
    [Token.Keep]: "keep",
    [Token.TBTC]: "tbtc",
  }

  const tokenState = useTokenState()

  // @ts-ignore
  const _token = tokenState[tokenMap[token]]

  return useMemo(() => _token.balance, [_token.balance])
}
