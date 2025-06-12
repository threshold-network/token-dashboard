import React, { createContext, useEffect } from "react"
import { Contract } from "@ethersproject/contracts"
import { AddressZero } from "@ethersproject/constants"
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
import { useIsActive } from "../hooks/useIsActive"
import { isL1Network, isL2Network } from "../networks/utils/connectedNetwork"

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
  const { account, isActive, chainId } = useIsActive()
  const fetchOwnerStakes = useFetchOwnerStakes()

  const {
    fetchTokenPriceUSD,
    setTokenBalance,
    setTokenConversionRate,
    setTokenLoading,
    setTokenIsLoadedFromConnectedAccount,
    keep: keepData,
    nu: nuData,
    t: tData,
    tbtc: tbtcData,
    tbtcv2: tbtcv2Data,
  } = useTokenState()

  const tokenContracts = {
    [Token.Keep]: keep.contract!,
    [Token.Nu]: nu.contract!,
    [Token.T]: t.contract!,
    [Token.TBTCV2]: tbtcv2.contract!,
  }

  const fetchBalances = useTokensBalanceCall(
    Object.values(tokenContracts),
    isActive ? account! : AddressZero
  )

  const fetchtBTCBalance = useTokensBalanceCall(
    [tbtcv2.contract!],
    isActive ? account! : AddressZero
  )

  //
  // SET T CONVERSION RATE FOR KEEP, NU
  //
  useEffect(() => {
    setTokenConversionRate(Token.Nu, nuConversion)
    setTokenConversionRate(Token.Keep, keepConversion)
  }, [nuConversion, keepConversion])

  //
  // SET USD PRICE
  //
  useEffect(() => {
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
  useEffect(() => {
    const tokens = Object.keys(tokenContracts) as Token[]

    const updateTokenState = (
      token: Token,
      balance: number | string = 0,
      isLoaded: boolean = false,
      isLoading: boolean = false
    ) => {
      if (token === Token.TBTCV2 && !featureFlags.TBTC_V2) {
        setTokenBalance(token, "0")
      } else {
        // Ensure balance is a valid string and not empty
        const balanceStr = balance ? balance.toString().trim() : "0"
        setTokenBalance(token, balanceStr || "0")
      }
      setTokenLoading(token, isLoading)
      setTokenIsLoadedFromConnectedAccount(token, isLoaded)
    }

    if (isActive && isL1Network(chainId)) {
      tokens.forEach((token) => setTokenLoading(token, true))
      fetchBalances().then(([keep, nu, t, tbtcv2]) => {
        const balances = [keep, nu, t, tbtcv2]

        balances.forEach((balance, index) =>
          updateTokenState(tokens[index], balance, true)
        )
      })
    } else if (isActive && isL2Network(chainId)) {
      tokens.forEach((token) => updateTokenState(token, 0))

      fetchtBTCBalance().then(([tbtcv2]) => {
        if (featureFlags.TBTC_V2) {
          updateTokenState(Token.TBTCV2, tbtcv2, true)
        }
      })
    } else {
      tokens.forEach((token) => updateTokenState(token, 0))
    }
  }, [isActive, chainId, account])

  // fetch user stakes when they connect their wallet
  useEffect(() => {
    fetchOwnerStakes(account!, chainId)
  }, [fetchOwnerStakes, account, chainId])

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
          ...tbtcv2,
          ...tbtcv2Data,
        },
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}
