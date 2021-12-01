import { useSelector } from "react-redux"
import { Token } from "../enums/token"
import { RootState } from "../store"

export const useTokenBalance = (token: Token) => {
  const _token = useSelector((state: RootState) => state.token[token])

  return _token.balance
}
