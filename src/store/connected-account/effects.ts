import { isZeroAddress } from "ethereumjs-util"
import { useAppSelector } from "../../hooks/store"
import { StakeData } from "../../types"
import { isSameETHAddress } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { selectStakeByStakingProvider, setStakes } from "../staking"
import {
  accountUsedAsStakingProvider,
  connectedAccountSlice,
  operatorMappingInitialFetchDone,
  setFetchingOperatorMapping,
  setMappedOperator,
} from "./connectedAccountSlice"

export const getStakingProviderOperatorInfo = async (
  action: ReturnType<typeof setStakes>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { connectedAccount } = listenerApi.getState()
    const { address } = connectedAccount
    const stakes = action.payload

    const stake = stakes.find((_: StakeData) =>
      isSameETHAddress(_.stakingProvider, address)
    )

    let isUsedAsStakingProvider = false

    if (stake) {
      isUsedAsStakingProvider = true
    } else {
      const { owner, authorizer, beneficiary } =
        await listenerApi.extra.threshold.staking.rolesOf(address)

      isUsedAsStakingProvider =
        !isZeroAddress(owner) &&
        !isZeroAddress(authorizer) &&
        !isZeroAddress(beneficiary)
    }

    if (!isUsedAsStakingProvider) return

    listenerApi.dispatch(
      setFetchingOperatorMapping({
        isFetching: true,
      })
    )
    listenerApi.dispatch(accountUsedAsStakingProvider())

    const mappedOperators =
      await listenerApi.extra.threshold.multiAppStaking.getMappedOperatorsForStakingProvider(
        address
      )

    listenerApi.dispatch(
      setMappedOperator({
        appName: "tbtc",
        operator: mappedOperators.tbtc,
      })
    )

    listenerApi.dispatch(
      setMappedOperator({
        appName: "randomBeacon",
        operator: mappedOperators.randomBeacon,
      })
    )

    listenerApi.dispatch(operatorMappingInitialFetchDone())
  } catch (error) {
    listenerApi.dispatch(
      connectedAccountSlice.actions.setFetchingOperatorMapping({
        isFetching: false,
      })
    )
    throw new Error("Could not load staking provider's operator info: " + error)
  }
}
