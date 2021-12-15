import { useContext } from "react"
import { TokenContext } from "../contexts/TokenContext"
import { Token } from "../enums"

export const useToken = (token: Token) => {
  const tokenContext = useContext(TokenContext)

  return tokenContext[token]
}
