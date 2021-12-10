import React, { createContext } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"
import { useT } from "../web3/hooks/useT"
import { useReduxToken } from "../hooks/useReduxToken"
import { Token } from "../enums"

export const TokenContext = createContext<{
  [key in Token]: any
}>({
  [Token.Keep]: {} as { contract: Contract },
  [Token.Nu]: {} as { contract: Contract },
  [Token.T]: {} as { contract: Contract },
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
      if (token) {
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
          balance: keepData.balance,
        },
        [Token.Nu]: {
          ...nu,
          balance: nuData.balance,
        },
        [Token.T]: {
          ...nu,
          balance: tData.balance,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
