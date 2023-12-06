import { useToken } from "../../hooks/useToken"
import { Token } from "../../enums"
import { useTStakingContract } from "./useTStakingContract"
import useApproveAndCall from "./userApproveAndCall"

const useApproveAndCallTStaking = (onSuccess?: () => Promise<void> | void) => {
  const tToken = useToken(Token.T)
  const tStakingContract = useTStakingContract()

  return useApproveAndCall(
    tToken.contract!,
    tStakingContract?.address,
    undefined,
    onSuccess
  )
}

export default useApproveAndCallTStaking
