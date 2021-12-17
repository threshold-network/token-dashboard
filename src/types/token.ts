import { Contract } from "@ethersproject/contracts"
import { Token } from "../enums"
import { TransactionType } from "../enums/transactionType"

export interface ReduxTokenInfo {
  loading: boolean
  conversionRate: number
  text: string
  icon: any
  balance: number | string
  usdConversion: number
  usdBalance: string
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number | string
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

export type TokenActionTypes = SetTokenBalance | SetTokenLoading

export interface UseReduxToken {
  (): {
    keep: ReduxTokenInfo
    nu: ReduxTokenInfo
    t: ReduxTokenInfo
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
