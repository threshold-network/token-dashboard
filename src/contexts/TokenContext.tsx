import React, { createContext } from "react"
import { useReduxToken } from "../hooks/useReduxToken"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { Token } from "../enums"
import { UseTokenContext } from "../types/token"
import _noop from "../utils/_noop"

const TokenContext = createContext({
  fetchKeepBalance: _noop,
})

export const useTokenContext: UseTokenContext = () =>
  React.useContext(TokenContext)

export const TokenContextProvider: React.FC = ({ children }) => {
  const { setTokenLoading, setTokenBalance } = useReduxToken()
  const { fetchBalance: keepBalanceFetcher } = useKeep()
  const { active } = useWeb3React()

  const fetchKeepBalance = async () => {
    setTokenLoading(Token.Keep, true)
    const balance = await keepBalanceFetcher()
    setTokenBalance(Token.Keep, balance)
    setTokenLoading(Token.Keep, false)
  }

  React.useEffect(() => {
    if (active) {
      fetchKeepBalance()
    }
  }, [active])

  return (
    <TokenContext.Provider
      value={{
        fetchKeepBalance,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
