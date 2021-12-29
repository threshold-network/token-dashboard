import React, { createContext } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"
import { useT } from "../web3/hooks/useT"
import { useReduxToken } from "../hooks/useReduxToken"
import { useTokensBalanceCall } from "../hooks/useTokensBalanceCall"
import { Token } from "../enums"
import { ReduxTokenInfo } from "../types"
import { useTBTCTokenContract } from "../web3/hooks"

export const TokenContext = createContext<{
  [key in Token]: { contract: Contract | null } & ReduxTokenInfo
}>({
  [Token.Keep]: {} as any,
  [Token.Nu]: {} as any,
  [Token.T]: {} as any,
  [Token.TBTC]: {} as any,
})

// Context that handles data fetching when a user connects their wallet or
// switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const keep = useKeep()
  const nu = useNu()
  const t = useT()
  const tbtc = useTBTCTokenContract()
  const { active, chainId, account } = useWeb3React()
  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    keep: keepData,
    nu: nuData,
    t: tData,
    tbtc: tbtcData,
  } = useReduxToken()

  const fetchBalances = useTokensBalanceCall(
    [keep.contract!, nu.contract!, t.contract!],
    account!
  )

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
      fetchBalances().then(([keepBalance, nuBalance, tBalance]) => {
        setTokenBalance(Token.Keep, keepBalance.toString())
        setTokenBalance(Token.Nu, nuBalance.toString())
        setTokenBalance(Token.T, tBalance.toString())
      })
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
        [Token.TBTC]: {
          ...tbtc,
          ...tbtcData,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
