import { useToken } from "../../hooks/useToken"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import { useTokenAllowance } from "./useTokenAllowance"

export const useTStakingAllowance = () => {
  const { contract: TTokenContract } = useToken(Token.T)
  const tStakingContract = useTStakingContract()
  return useTokenAllowance(TTokenContract!, tStakingContract?.address)
}
