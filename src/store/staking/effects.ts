import { isSameChainId } from "../../networks/utils"
import { StakeData } from "../../types"
import { isAddress, isAddressZero } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { selectStakeByStakingProvider } from "./selectors"
import { requestStakeByStakingProvider, setStakes } from "./stakingSlice"

export const fetchStakeByStakingProviderEffect = async (
  actionCreator: ReturnType<typeof requestStakeByStakingProvider>,
  listenerApi: AppListenerEffectAPI
) => {
  const { account } = listenerApi.getState()
  const { stakingProvider } = actionCreator.payload
  const { config } = listenerApi.extra.threshold

  if (
    !listenerApi.extra.threshold.staking ||
    !stakingProvider ||
    !isAddress(stakingProvider) ||
    isAddressZero(stakingProvider) ||
    !account.chainId ||
    !isSameChainId(account.chainId, config.ethereum.chainId)
  )
    return

  const stake = selectStakeByStakingProvider(
    listenerApi.getState(),
    stakingProvider
  )

  // If the stake exitst in the store we don't need to fetch data.
  if (stake) return

  const result = await listenerApi.take(setStakes.match, 10000)
  //  If a timeout is provided and expires first, the promise resolves to
  //  null.
  if (result === null) {
    await fetchStake(stakingProvider, listenerApi)
    return
  }

  // Check again if the stake exists after dispatching `setStakes` action.
  const [action, currentState, previousState] = result
  const stakeAfterDispatchingSetStakes = selectStakeByStakingProvider(
    currentState,
    stakingProvider
  )
  // Stakes exists for a current logged account- there is no need to fetch data
  // by the staking provider address.
  if (stakeAfterDispatchingSetStakes) return

  await fetchStake(stakingProvider, listenerApi)
}

const fetchStake = async (
  stakingProvider: string,
  listenerApi: AppListenerEffectAPI
) => {
  const stake =
    await listenerApi.extra.threshold.staking!.getStakeByStakingProvider(
      stakingProvider
    )

  if (
    isAddressZero(stake.owner) ||
    isAddressZero(stake.beneficiary) ||
    isAddressZero(stake.authorizer)
  ) {
    return
  }

  listenerApi.dispatch(
    setStakes([
      {
        ...stake,
        tStake: stake.tStake.toString(),
        keepInTStake: stake.keepInTStake.toString(),
        nuInTStake: stake.nuInTStake.toString(),
        totalInTStake: stake.totalInTStake.toString(),
        possibleKeepTopUpInT: "0",
        possibleNuTopUpInT: "0",
      } as StakeData,
    ])
  )
}
