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

      // TODO:
      // - This only signals no Merkle rewards, but there may be TACo rewards
      // - We can still call the new Merkle contract with a claim with an empty 
      //   merkle proof, signalling to not try to claim Merkle rewards. This
      //   will still try to claim TACo rewards automatically.
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
