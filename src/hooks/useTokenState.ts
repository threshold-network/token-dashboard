import {
  setTokenBalance as setTokenBalanceAction,
  setTokenLoading as setTokenLoadingAction,
  fetchTokenPriceUSD as fetchTokenPriceAction,
  setTokenBalanceError as setTokenBalanceErrorAction,
} from "../store/tokens"
import { useAppDispatch, useAppSelector } from "./store"
import { Token } from "../enums"
import { UseTokenState } from "../types/token"
import { useCallback } from "react"

export const useTokenState: UseTokenState = () => {
  const keep = useAppSelector((state) => state.token[Token.Keep])
  const nu = useAppSelector((state) => state.token[Token.Nu])
  const t = useAppSelector((state) => state.token[Token.T])
  const tbtc = useAppSelector((state) => state.token[Token.TBTC])
  const tbtcv2 = useAppSelector((state) => state.token[Token.TBTCV2])

  const dispatch = useAppDispatch()

  const setTokenBalance = useCallback(
    (token: Token, balance: number | string) =>
      dispatch(setTokenBalanceAction({ token, balance })),
    [dispatch]
  )

  const setTokenLoading = useCallback(
    (token: Token) => dispatch(setTokenLoadingAction({ token })),
    [dispatch]
  )

  const fetchTokenPriceUSD = useCallback(
    (token: Token) => dispatch(fetchTokenPriceAction({ token })),
    [dispatch]
  )

  const setTokenBalanceError = useCallback(
    (token: Token) => dispatch(setTokenBalanceErrorAction({ token })),
    [dispatch]
  )

  return {
    keep,
    nu,
    t,
    tbtc,
    tbtcv2,
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenLoading,
    setTokenBalanceError,
  }
}
