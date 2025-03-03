import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  useMerkleDropContract,
  DEPLOYMENT_BLOCK,
} from "../web3/hooks/useMerkleDropContract"
import rewardsData from "../merkle-drop/rewards.json"
import { getContractPastEvents, getAddress } from "../web3/utils"
import { RewardsJSONData } from "../types"
import { RootState } from "../store"
import { setInterimRewards } from "../store/rewards"
import { selectStakingProviders } from "../store/staking"
import { BigNumber } from "ethers"
import { Zero } from "@ethersproject/constants"
import { useMulticall } from "../web3/hooks/useMulticall"
import { ContractCall } from "../threshold-ts/multicall"

interface StakingRewards {
  [stakingProvider: string]: string
}

export const useFetchStakingRewards = () => {
  const merkleDropContract = useMerkleDropContract()
  const stakingProviders = useSelector(selectStakingProviders)
  const { hasFetched, isFetching } = useSelector(
    (state: RootState) => state.rewards.interim
  )
  const dispatch = useDispatch()

  const cumulativeClaimedCalls: ContractCall[] = stakingProviders.map(
    (stakingProvider) => ({
      address: merkleDropContract!.address,
      interface: merkleDropContract!.interface!,
      method: "cumulativeClaimed",
      args: [stakingProvider],
    })
  )
  const fetchCumulativeClaims = useMulticall(cumulativeClaimedCalls)

  useEffect(() => {
    const fetch = async () => {
      if (
        !merkleDropContract ||
        stakingProviders.length === 0 ||
        (hasFetched && !isFetching)
      ) {
        return
      }

      // TODO:
      // - Integration of new Merkle contract + TACo automated rewards here.
      //   TLDR: stakingRewards = merkle_rewards + taco_rewards
      //   See https://github.com/threshold-network/token-dashboard/issues/756
      // - There's a more efficient way to check Merkle's claimed rewards.
      //   See https://github.com/threshold-network/token-dashboard/issues/765
      // - Note also that TACo rewards now accrue on each block. They can be
      //   calculated via TACoApp.availableRewards(address _stakingProvider)

      const cumulativeClaimedResults = await fetchCumulativeClaims()
      console.log(cumulativeClaimedResults)

      const claimedAmountToStakingProvider = stakingProviders.reduce(
        (acc, stakingProvider, index) => {
          acc[getAddress(stakingProvider)] =
            cumulativeClaimedResults[index].toString()
          return acc
        },
        {} as { [stakingProvider: string]: string }
      )
      console.log(claimedAmountToStakingProvider)

      // const claimedRewardsInCurrentMerkleRoot = new Set(
      //   claimedEvents
      //     .filter((_) => _.args?.merkleRoot === rewardsData.merkleRoot)
      //     .map((_) => getAddress(_.args?.stakingProvider as string))
      // )

      const stakingRewards: StakingRewards = {}
      for (const stakingProvider of stakingProviders) {
        if (!(stakingProvider in (rewardsData as RewardsJSONData).claims)) {
          // If the JSON file doesn't contain proofs for a given staking
          // provider it means this staking provider has no Merkle rewards
          continue
        }
        const { amount } = (rewardsData as RewardsJSONData).claims[
          stakingProvider
        ]
        const claimedAmount =
          claimedAmountToStakingProvider[stakingProvider] || "0"
        if (BigNumber.from(amount).eq(BigNumber.from(claimedAmount))) {
          // if the claimed amount is equal to the amount of rewards available, then skip
          continue
        }
        // TODO: ^ But there's going to be TACo rewards

        // If the `Claimed` event exists with a current merkle
        // root for a given staking provider it means that rewards have
        // already been claimed - we can skip this iteration.
        // TODO: ^ Same, there can be TACo rewards
        const claimableAmount = BigNumber.from(amount).sub(
          claimedAmountToStakingProvider[stakingProvider] || Zero
        )

        if (claimableAmount.lte(Zero)) {
          continue
        }

        stakingRewards[stakingProvider] = claimableAmount.toString()
      }

      dispatch(setInterimRewards(stakingRewards))
    }

    fetch()
  }, [
    stakingProviders,
    merkleDropContract,
    hasFetched,
    isFetching,
    dispatch,
    fetchCumulativeClaims,
  ])
}
