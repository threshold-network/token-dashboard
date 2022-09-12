import { useCallback, useEffect, useState } from "react"
import {
  DEPLOYMENT_BLOCK,
  useMerkleDropContract,
} from "../web3/hooks/useMerkleDropContract"
import rewardsData from "../merkle-drop/rewards.json"
import { getContractPastEvents } from "../web3/utils"
import { RewardsJSONData } from "../types"
import { BigNumber } from "ethers"
import { Zero } from "@ethersproject/constants"

export const useFetchRewardsForSingleStake = (
  stakingProvider: string
): string => {
  const [rewards, setRewards] = useState<BigNumber>(BigNumber.from(Zero))

  const merkleDropContract = useMerkleDropContract()

  const fetchRewardsForStake = useCallback(async () => {
    // check that params and dependencies are available
    if (!merkleDropContract || !stakingProvider) {
      return BigNumber.from(Zero)
    }

    // fetch all claimed events for the requested stake
    const claimedEvents = await getContractPastEvents(merkleDropContract, {
      eventName: "Claimed",
      fromBlock: DEPLOYMENT_BLOCK,
      filterParams: [stakingProvider],
    })

    // determine if the user has already claimed rewards for this stake by reading events
    const amountAlreadyClaimedFromStake = claimedEvents.reduce(
      (totalRewardBalance: BigNumber, event): BigNumber => {
        const prevBalance = BigNumber.from(totalRewardBalance || Zero)

        const updatedRewardsBalance = prevBalance.add(
          event.args?.amount as string
        )
        return updatedRewardsBalance
      },
      BigNumber.from(Zero)
    )

    // Check the merkle root for additional rewards that may have been claimed
    const claimedRewardsInCurrentMerkleRoot = new Set(
      claimedEvents
        .filter((_) => _.args?.merkleRoot === rewardsData.merkleRoot)
        .map((_) => stakingProvider)
    )

    // Compute the final reward balance for the stake

    // starting at Zero...
    let stakeRewards: BigNumber = BigNumber.from(Zero)

    // check that stake is qualified for rewards
    if (
      !rewardsData.claims.hasOwnProperty(stakingProvider) ||
      claimedRewardsInCurrentMerkleRoot.has(stakingProvider)
    ) {
      // get the total amount of rewards
      const claimData = (rewardsData as RewardsJSONData).claims[stakingProvider]

      // return 0 if the stake has no rewads data
      if (!claimData) return stakeRewards

      // subtract the amount already claimed
      const claimableAmount = BigNumber.from(claimData.amount).sub(
        amountAlreadyClaimedFromStake || Zero
      )

      // account for edge cases
      if (claimableAmount.lte(Zero)) {
        stakeRewards = claimableAmount
      }
    }
    return stakeRewards
  }, [stakingProvider, merkleDropContract])

  useEffect(() => {
    const fetchAndSetRewards = async () => {
      setRewards(await fetchRewardsForStake())
    }
    fetchAndSetRewards()
  }, [fetchRewardsForStake])

  return rewards.toString()
}
