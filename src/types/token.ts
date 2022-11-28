import { Contract } from "@ethersproject/contracts"
import { Token } from "../enums"
import { TransactionType } from "../enums/transactionType"
import Icon from "../enums/icon"
import { IERC20, IERC20WithApproveAndCall } from "../threshold-ts/tokens/erc20"

export interface TokenState {
  loading: boolean
  text: string
  icon: Icon
  balance: number | string
  usdConversion: number
  usdBalance: string
  decimals?: number
  error: string
}

export interface SetTokenBalanceActionPayload {
  token: Token
  balance: number | string
}

export interface SetTokenBalanceErrorActionPayload {
  token: Token
  error: string
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
    setTokenBalanceError: (token: Token, error: string) => TokenActionTypes
  }
}

export interface BalanceOf {
  (token: Token): Promise<void>
}

export interface Approve {
  (spender: string, amount: string): any
}

export interface UseErc20Interface {
  (token: IERC20WithApproveAndCall | IERC20, tokenName: Token): {
    balanceOf: BalanceOf
    wrapper: IERC20 | IERC20WithApproveAndCall
    contract: Contract | null
  }
}

export type UpgredableToken = Token.Nu | Token.Keep
