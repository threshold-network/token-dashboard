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

      const claimedEvents = await getContractPastEvents(merkleDropContract, {
        eventName: "Claimed",
        fromBlock: DEPLOYMENT_BLOCK,
        filterParams: [stakingProviders],
      })

      const claimedAmountToStakingProvider = claimedEvents.reduce(
        (
          reducer: { [stakingProvider: string]: string },
          event
        ): { [stakingProvider: string]: string } => {
          const stakingProvider = getAddress(
            event.args?.stakingProvider as string
          )
          const prevAmount = BigNumber.from(reducer[stakingProvider] || Zero)
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

      const stakingRewards: StakingRewards = {}
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
  }, [stakingProviders, merkleDropContract, hasFetched, isFetching, dispatch])
}
