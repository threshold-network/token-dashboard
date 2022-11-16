import { BigNumber, ContractTransaction } from "ethers"
import { IRewards } from ".."
import { MerkleDropContract } from "../merkle-drop-contract"
import { getAddress, getContractPastEvents, ZERO } from "../../utils"
import rewardsData from "./rewards.json"

export interface RewardsJSONData {
  totalAmount: string
  merkleRoot: string
  claims: {
    [stakingProvider: string]: {
      amount: string
      proof: string[]
      beneficiary: string
    }
  }
}
export type Rewards = string

export class InterimStakingRewards implements IRewards<Rewards> {
  private readonly _merkleDropContract: MerkleDropContract

  constructor(merkleDropContract: MerkleDropContract) {
    this._merkleDropContract = merkleDropContract
  }

  claim = (stakingProviders: string[]): Promise<ContractTransaction> => {
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
    return this._merkleDropContract.instance.batchClaim(
      merkleRoot,
      availableRewardsToClaim
    )
  }

  /**
   * Calculates rewards for given staking providers. NOTE that the calculated
   * reward for each staking provider may include a staking bonus.
   * @param {string[]} stakingProviders Staking providers.
   * @return {Promise<Rewards>} Rewards data grouped by staking provider
   * address.
   */
  calculateRewards = async (
    stakingProviders: string[]
  ): Promise<{ [stakingProvider: string]: Rewards }> => {
    const claimedEvents = await getContractPastEvents(
      this._merkleDropContract.instance,
      {
        eventName: "Claimed",
        fromBlock: this._merkleDropContract.deploymentBlock,
        filterParams: [stakingProviders],
      }
    )

    const claimedAmountToStakingProvider = claimedEvents.reduce(
      (
        reducer: { [stakingProvider: string]: string },
        event
      ): { [stakingProvider: string]: string } => {
        const stakingProvider = getAddress(
          event.args?.stakingProvider as string
        )
        const prevAmount = BigNumber.from(reducer[stakingProvider] || ZERO)
        reducer[stakingProvider] = prevAmount
          .add(event.args?.amount as string)
          .toString()
        return reducer
      },
      {}
    )

    const claimedRewardsInCurrentMerkleRoot = new Set(
      claimedEvents
        .filter((_) => _.args?.merkleRoot === rewardsData.merkleRoot)
        .map((_) => getAddress(_.args?.stakingProvider as string))
    )

    const stakingRewards: { [stakingProvider: string]: Rewards } = {}
    for (const stakingProvider of stakingProviders) {
      if (
        !rewardsData.claims.hasOwnProperty(stakingProvider) ||
        claimedRewardsInCurrentMerkleRoot.has(stakingProvider)
      ) {
        // If the JSON file doesn't contain proofs for a given staking
        // provider it means this staking provider has no rewards- we can skip
        // this iteration. If the `Claimed` event exists with a current merkle
        // root for a given staking provider it means that rewards have
        // already been claimed- we can skip this iteration.
        continue
      }

      const { amount } = (rewardsData as RewardsJSONData).claims[
        stakingProvider
      ]
      const claimableAmount = BigNumber.from(amount).sub(
        claimedAmountToStakingProvider[stakingProvider] || ZERO
      )

      if (claimableAmount.lte(ZERO)) {
        continue
      }

      stakingRewards[stakingProvider] = claimableAmount.toString()
    }
    return stakingRewards
  }
}
