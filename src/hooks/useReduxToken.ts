import { useSelector, useDispatch } from "react-redux"
import {
  setTokenBalance as setTokenBalanceAction,
  setTokenLoading as setTokenLoadingAction,
} from "../store/tokens"
import { RootState } from "../store"
import { Token } from "../enums"
import { UseReduxToken } from "../types/token"

export const useReduxToken: UseReduxToken = () => {
  const keep = useSelector((state: RootState) => state.token[Token.Keep])
  const nu = useSelector((state: RootState) => state.token[Token.Nu])

  const dispatch = useDispatch()

  const setTokenBalance = (token: Token, balance: number) =>
    dispatch(setTokenBalanceAction({ token, balance }))

  const setTokenLoading = (token: Token, loading: boolean) =>
    dispatch(setTokenLoadingAction({ token, loading }))

  return {
    keep,
    nu,
    setTokenBalance,
    setTokenLoading,
  }
}
