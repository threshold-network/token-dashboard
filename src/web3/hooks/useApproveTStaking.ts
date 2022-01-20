import { useToken } from "../../hooks/useToken"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import useApproval from "./useApproval"

export const useApproveTStaking = (onSuccess?: () => Promise<void> | void) => {
  const tToken = useToken(Token.T)
  const tStakingContract = useTStakingContract()
  return useApproval(tToken.contract!, tStakingContract?.address, onSuccess)
}
