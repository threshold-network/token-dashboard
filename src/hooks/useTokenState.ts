import {
  setTokenBalance as setTokenBalanceAction,
  setTokenLoading as setTokenLoadingAction,
  fetchTokenPriceUSD as fetchTokenPriceAction,
} from "../store/tokens"
import { useAppDispatch, useAppSelector } from "./store"
import { Token } from "../enums"
import { UseTokenState } from "../types/token"

export const useTokenState: UseTokenState = () => {
  const keep = useAppSelector((state) => state.token[Token.Keep])
  const nu = useAppSelector((state) => state.token[Token.Nu])
  const t = useAppSelector((state) => state.token[Token.T])
  const tbtc = useAppSelector((state) => state.token[Token.TBTC])
  const tbtcv2 = useAppSelector((state) => state.token[Token.TBTCV2])

  const dispatch = useAppDispatch()

  const setTokenBalance = (token: Token, balance: number | string) =>
    dispatch(setTokenBalanceAction({ token, balance }))

  const setTokenLoading = (token: Token) =>
    dispatch(setTokenLoadingAction({ token }))

  const fetchTokenPriceUSD = (token: Token) =>
    dispatch(fetchTokenPriceAction({ token }))

  return {
    keep,
    nu,
    t,
    tbtc,
    tbtcv2,
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenLoading,
  }
}
