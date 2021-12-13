import React, { createContext } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"
import { useT } from "../web3/hooks/useT"
import { useReduxToken } from "../hooks/useReduxToken"
import { Token } from "../enums"
import { ReduxTokenInfo } from "../types"

interface TokenContextState extends ReduxTokenInfo {
  contract: Contract | null
}

export const TokenContext = createContext<{
  [key in Token]: TokenContextState
}>({
  [Token.Keep]: {} as TokenContextState,
  [Token.Nu]: {} as TokenContextState,
  [Token.T]: {} as TokenContextState,
})

// Context that handles data fetching when a user connects their wallet or
// switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const keep = useKeep()
  const nu = useNu()
  const t = useT()

  const { active, chainId } = useWeb3React()
  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    keep: keepData,
    nu: nuData,
    t: tData,
  } = useReduxToken()

  React.useEffect(() => {
    for (const token in Token) {
      // TODO: how to calculate T token price in USD.
      if (token !== Token.T) {
        // @ts-ignore
        fetchTokenPriceUSD(Token[token])
      }
    }
  }, [])

  React.useEffect(() => {
    if (active) {
      keep.fetchKeepBalance()
      nu.fetchNuBalance()
      t.fetchTBalance()
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

  return (
    <TokenContext.Provider
      value={{
        [Token.Keep]: {
          ...keep,
          ...keepData,
        },
        [Token.Nu]: {
          ...nu,
          ...nuData,
        },
        [Token.T]: {
          ...t,
          ...tData,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
