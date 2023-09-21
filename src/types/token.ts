import { Contract } from "@ethersproject/contracts"
import { Token } from "../enums"
import { TransactionType } from "../enums/transactionType"
import { TokenIcon } from "../static/icons/tokenIconMap"

export interface TokenState {
  loading: boolean
  conversionRate: number | string
  text: string
  icon: TokenIcon
  balance: number | string
  usdConversion: number
  usdBalance: string
  decimals?: number
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number | string
}

export interface SetTokenConversionRateActionPayload {
  token: Token
  conversionRate: string | number
}

export interface SetTokenLoadingActionPayload {
  token: Token
  loading: boolean
}

export interface SetTokenBalance {
  payload: SetTokenBalanceActionPayload
}

export interface SetTokenLoading {
  payload: SetTokenLoadingActionPayload
}

export interface SetTokenConversionRate {
  payload: SetTokenConversionRateActionPayload
}

export type TokenActionTypes =
  | SetTokenBalance
  | SetTokenLoading
  | SetTokenConversionRate

export interface UseTokenState {
  (): {
    keep: TokenState
    nu: TokenState
    t: TokenState
    tbtc: TokenState
    tbtcv2: TokenState
    setTokenBalance: (
      token: Token,
      balance: number | string
    ) => TokenActionTypes
    setTokenConversionRate: (
      token: Token,
      conversionRate: number | string
    ) => TokenActionTypes
    setTokenLoading: (token: Token, loading: boolean) => TokenActionTypes
    fetchTokenPriceUSD: (token: Token) => void
  }
}

export interface BalanceOf {
  (token: Token): Promise<void>
}

export interface Approve {
  (transactionType: TransactionType): any
}

export interface UseErc20Interface {
  (tokenAddress: string, withSignerIfPossible?: boolean, abi?: any): {
    approve: Approve
    balanceOf: BalanceOf
    contract: Contract | null
  }
}

export type UpgredableToken = Token.Nu | Token.Keep
