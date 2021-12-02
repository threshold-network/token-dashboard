import { Token } from "../enums/token"
import { useToken } from "./useToken"

export const useTokenBalance = (token: Token) => {
  const _token = useToken(token)

  return _token.balance
}
