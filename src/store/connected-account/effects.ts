import { isZeroAddress } from "ethereumjs-util"
import { AppListenerEffectAPI } from "../listener"
import { setStakes } from "../staking"
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
    listenerApi.dispatch(
      setFetchingOperatorMapping({
        isFetching: true,
      })
    )
    const { connectedAccount } = listenerApi.getState()
    const { address } = connectedAccount
    const { owner, authorizer, beneficiary } =
      await listenerApi.extra.threshold.staking.rolesOf(address)

    const isUsedAsStakingProvider =
      !isZeroAddress(owner) &&
      !isZeroAddress(authorizer) &&
      !isZeroAddress(beneficiary)

    if (isUsedAsStakingProvider) {
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

      listenerApi.dispatch(setFetchingOperatorMapping({ isFetching: false }))

      listenerApi.dispatch(operatorMappingInitialFetchDone())
    }
  } catch (error) {
    listenerApi.dispatch(
      connectedAccountSlice.actions.setFetchingOperatorMapping({
        isFetching: false,
      })
    )
    throw new Error("Could not load staking provider's operator info: " + error)
  }
}
