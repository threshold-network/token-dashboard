import React, { createContext } from "react"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
import { useWeb3React } from "@web3-react/core"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"
import { useT } from "../web3/hooks/useT"
import { useTokenState } from "../hooks/useTokenState"
import { useTokensBalanceCall } from "../hooks/useTokensBalanceCall"
import { Token } from "../enums"
import { TokenState } from "../types"
import { useTBTCTokenContract } from "../web3/hooks"
import { useVendingMachineRatio } from "../web3/hooks/useVendingMachineRatio"
import { useFetchOwnerStakes } from "../hooks/useFetchOwnerStakes"
import { useTBTCv2TokenContract } from "../web3/hooks/useTBTCv2TokenContract"
import { featureFlags } from "../constants"

interface TokenContextState extends TokenState {
  contract: Contract | null
}

export const TokenContext = createContext<{
  [key in Token]: TokenContextState
}>({
  [Token.Keep]: {} as TokenContextState,
  [Token.Nu]: {} as TokenContextState,
  [Token.T]: {} as TokenContextState,
  [Token.TBTC]: {} as TokenContextState,
  [Token.TBTCV2]: {} as TokenContextState,
})

// Context that handles data fetching when a user connects their wallet or
// switches their network
export const TokenContextProvider: React.FC = ({ children }) => {
  const keep = useKeep()
  const nu = useNu()
  const t = useT()
  const tbtc = useTBTCTokenContract()
  const tbtcv2 = useTBTCv2TokenContract()
  const nuConversion = useVendingMachineRatio(Token.Nu)
  const keepConversion = useVendingMachineRatio(Token.Keep)
  const { active, chainId, account } = useWeb3React()
  const fetchOwnerStakes = useFetchOwnerStakes()

  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenConversionRate,
    keep: keepData,
    nu: nuData,
    t: tData,
    tbtc: tbtcData,
    tbtcv2: tbtcv2Data,
  } = useTokenState()

  const tokenContracts = [keep.contract!, nu.contract!, t.contract!]

  if (featureFlags.TBTC_V2) tokenContracts.push(tbtcv2)

  const fetchBalances = useTokensBalanceCall(
    tokenContracts,
    active ? account! : AddressZero
  )

  //
  // SET T CONVERSION RATE FOR KEEP, NU
  //
  React.useEffect(() => {
    setTokenConversionRate(Token.Nu, nuConversion)
    setTokenConversionRate(Token.Keep, keepConversion)
  }, [nuConversion, keepConversion])

  //
  // SET USD PRICE
  //
  React.useEffect(() => {
    for (const token in Token) {
      if (token) {
        // @ts-ignore
        fetchTokenPriceUSD(Token[token])
      }
    }
  }, [])

  //
  // FETCH BALANCES ON WALLET LOAD OR NETWORK SWITCH
  //
  React.useEffect(() => {
    if (active) {
      fetchBalances().then(
        ([keepBalance, nuBalance, tBalance, tbtcv2Balance]) => {
          setTokenBalance(Token.Keep, keepBalance.toString())
          setTokenBalance(Token.Nu, nuBalance.toString())
          setTokenBalance(Token.T, tBalance.toString())
          if (featureFlags.TBTC_V2) {
            setTokenBalance(Token.TBTCV2, tbtcv2Balance.toString())
          }
        }
      )
    } else {
      // set all token balances to 0 if the user disconnects the wallet
      for (const token in Token) {
        if (token) {
          // @ts-ignore
          setTokenBalance(Token[token], 0)
        }
      }
    }
  }, [active, chainId, account])

  // fetch user stakes when they connect their wallet
  React.useEffect(() => {
    fetchOwnerStakes(account!)
  }, [fetchOwnerStakes, account])

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
        [Token.TBTCV2]: {
          contract: tbtcv2,
          ...tbtcv2Data,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
