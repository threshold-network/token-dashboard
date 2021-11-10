import React, { createContext } from "react"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"
import { useReduxToken } from "../hooks/useReduxToken"
import { Token } from "../enums"

const TokenContext = createContext({})

// Context that handles data fetching when a user connects their wallet or switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const { fetchBalance: fetchKeepBalance } = useKeep()
  const { fetchBalance: fetchNuBalance } = useNu()
  const { active, chainId } = useWeb3React()
  const { fetchTokenPriceUSD, setTokenBalance } = useReduxToken()

  React.useEffect(() => {
    for (const token in Token) {
      if (token) {
        // @ts-ignore
        fetchTokenPriceUSD(Token[token])
      }
    }
  }, [])

  React.useEffect(() => {
    if (active) {
      fetchKeepBalance()
      fetchNuBalance()
    } else {
      // set all token balances to 0 if the user disconnects the wallet
      for (const token in Token) {
        if (token) {
          // @ts-ignore
          setTokenBalance(Token[token], 0)
        }
      }
    }
  }, [active, chainId])

  return <TokenContext.Provider value={{}}>{children}</TokenContext.Provider>
}
