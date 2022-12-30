import {
  tokenBalanceFetched as setTokenBalanceAction,
  tokenBalanceFetching as setTokenLoadingAction,
  fetchTokenPriceUSD as fetchTokenPriceAction,
  tokenBalanceFetchFailed as setTokenBalanceErrorAction,
} from "../store/tokens"
import { useAppDispatch, useAppSelector } from "./store"
import { Token } from "../enums"
import { UseTokenState } from "../types/token"
import { useCallback } from "react"

export const useTokenState: UseTokenState = () => {
  const keep = useAppSelector((state) => state.token[Token.Keep])
  const nu = useAppSelector((state) => state.token[Token.Nu])
  const t = useAppSelector((state) => state.token[Token.T])
  const tbtcv1 = useAppSelector((state) => state.token[Token.TBTCV1])
  const tbtc = useAppSelector((state) => state.token[Token.TBTC])

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
    (token: Token, error: string) =>
      dispatch(setTokenBalanceErrorAction({ token, error })),
    [dispatch]
  )

  return {
    keep,
    nu,
    t,
    tbtc: tbtcv1,
    tbtcv2: tbtc,
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenLoading,
    setTokenBalanceError,
  }
}
