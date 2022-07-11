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

  useEffect(() => {
    const fetch = async () => {
      if (
        !merkleDropContract ||
        stakingProviders.length === 0 ||
        (hasFetched && !isFetching)
      ) {
        return
      }

      const claimedRewards = new Set(
        (
          await getContractPastEvents(merkleDropContract, {
            eventName: "Claimed",
            fromBlock: DEPLOYMENT_BLOCK,
            filterParams: [stakingProviders],
          })
        )
          .filter((_) => _.args?.merkleRoot === rewardsData.merkleRoot)
          .map((_) => getAddress(_.args?.stakingProvider as string))
      )

      const stakingRewards: StakingRewards = {}
      for (const stakingProvider of stakingProviders) {
        if (
          !rewardsData.claims.hasOwnProperty(stakingProvider) ||
          claimedRewards.has(stakingProvider)
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
        stakingRewards[stakingProvider] = amount
      }

      dispatch(setInterimRewards(stakingRewards))
    }

    fetch()
  }, [stakingProviders, merkleDropContract, hasFetched, isFetching, dispatch])
}
