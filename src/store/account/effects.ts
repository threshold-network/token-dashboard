import { StakeData } from "../../types"
import { isAddressZero, isSameETHAddress } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { setStakes } from "../staking"
import {
  accountUsedAsStakingProvider,
  accountSlice,
  operatorMappingInitialFetchDone,
  setFetchingOperatorMapping,
  setMappedOperator,
} from "./slice"

export const getStakingProviderOperatorInfo = async (
  action: ReturnType<typeof setStakes>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { account } = listenerApi.getState()
    const { address } = account
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
        !isAddressZero(owner) &&
        !isAddressZero(authorizer) &&
        !isAddressZero(beneficiary)
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

    listenerApi.dispatch(
      setMappedOperator({
        appName: "pre",
        operator: mappedOperators.pre,
      })
    )

    listenerApi.dispatch(operatorMappingInitialFetchDone())
  } catch (error) {
    listenerApi.dispatch(
      accountSlice.actions.setFetchingOperatorMapping({
        isFetching: false,
      })
    )
    throw new Error("Could not load staking provider's operator info: " + error)
  }
}
