import { useCallback } from "react"
import { Token } from "../../enums"
import { useTokenState } from "../../hooks/useTokenState"
import { UseErc20Interface } from "../../types/token"
import {
  IERC20,
  IERC20WithApproveAndCall,
} from "../../threshold-ts/tokens/erc20"

export const useErc20TokenContract: UseErc20Interface = (
  token: IERC20WithApproveAndCall | IERC20,
  tokenName: Token
) => {
  const { setTokenLoading, setTokenBalance, setTokenBalanceError } =
    useTokenState()

  const balanceOf = useCallback(
    async (address) => {
      try {
        setTokenLoading(tokenName, true)
        const balance = await token.balanceOf(address)
        setTokenBalance(tokenName, balance.toString())
      } catch (error) {
        const errorMessage = `Error: Fetching ${token} balance failed for ${address}`
        setTokenBalanceError(tokenName, errorMessage)
        console.log(
          `Error: Fetching ${token} balance failed for ${address}`,
          error
        )
      }
    },
    [token, tokenName, setTokenLoading, setTokenBalanceError]
  )

  return { balanceOf, contract: token.contract, wrapper: token }
}
