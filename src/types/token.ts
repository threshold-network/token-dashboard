import { Contract } from "@ethersproject/contracts"
import { Token } from "../enums"
import { TransactionType } from "../enums/transactionType"
import Icon from "../enums/icon"

export interface TokenState {
  loading: boolean
  text: string
  icon: Icon
  balance: number | string
  usdConversion: number
  usdBalance: string
  decimals?: number
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number | string
}

export interface SetTokenLoadingActionPayload {
  token: Token
}

export interface SetTokenBalance {
  payload: SetTokenBalanceActionPayload
}

export interface SetTokenLoading {
  payload: SetTokenLoadingActionPayload
}

export type TokenActionTypes = SetTokenBalance | SetTokenLoading

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
