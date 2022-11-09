import { createSelector } from "@reduxjs/toolkit"
import { RootState } from ".."
import { TokensState } from "./tokenSlice"
import { Token } from "../../enums"

export const selectTokensState = (state: RootState) => state.token

export const selectTokenByTokenName = createSelector(
  [selectTokensState, (_: RootState, tokenName: Token) => tokenName],
  (tokensState: TokensState, tokenName: Token) => {
    return tokensState[tokenName]
  }
)
