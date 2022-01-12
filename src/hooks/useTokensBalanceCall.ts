import { Contract } from "@ethersproject/contracts"
import { useMulticall } from "../web3/hooks/useMulticall"

export const useTokensBalanceCall = (tokens: Contract[], address: string) => {
  return useMulticall(
    tokens.map((tokenContract) => ({
      contract: tokenContract,
      method: "balanceOf",
      args: [address],
    }))
  )
}
