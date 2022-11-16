import { ContractTransaction } from "@ethersproject/contracts"
import { useSendTransactionFromFn } from "./useSendTransaction"
import { useThreshold } from "../../contexts/ThresholdContext"
import { InterimStakingRewards } from "../../threshold-ts/rewards/interim"

export const useClaimMerkleRewardsTransaction = (
  onSuccess?: (tx: ContractTransaction) => void
) => {
  const threshold = useThreshold()
  const { sendTransaction, status } = useSendTransactionFromFn(
    (threshold.rewards.interim as InterimStakingRewards).claim,
    onSuccess
  )

  return { claim: sendTransaction, status }
}
