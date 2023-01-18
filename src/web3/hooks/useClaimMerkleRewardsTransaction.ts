import { useCallback } from "react"
import { useMerkleDropContract } from "./useMerkleDropContract"
import rewardsData from "../../merkle-drop/rewards.json"
import { OnSuccessCallback, useSendTransaction } from "./useSendTransaction"
import { RewardsJSONData } from "../../types"

export const useClaimMerkleRewardsTransaction = (
  onSuccess?: OnSuccessCallback
) => {
  const merkleDropContract = useMerkleDropContract()
  const { sendTransaction, status } = useSendTransaction(
    merkleDropContract!,
    "batchClaim",
    onSuccess
  )

  const claim = useCallback(
    (stakingProviders: string[]) => {
      if (!stakingProviders || stakingProviders.length === 0) {
        throw new Error("Staking providers not found.")
      }
      const availableRewardsToClaim = []

      for (const stakingProvider of stakingProviders) {
        if (!rewardsData.claims.hasOwnProperty(stakingProvider)) continue

        const { amount, beneficiary, proof } = (rewardsData as RewardsJSONData)
          .claims[stakingProvider]
        availableRewardsToClaim.push([
          stakingProvider,
          beneficiary,
          amount,
          proof,
        ])
      }

      if (availableRewardsToClaim.length === 0) {
        throw new Error("No rewards to claim.")
      }

      const { merkleRoot } = rewardsData
      sendTransaction(merkleRoot, availableRewardsToClaim)
    },
    [merkleDropContract]
  )

  return { claim, status }
}
