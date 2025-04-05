import { StakeData } from "../../types"
import { isAddressZero, isSameAddress } from "../../web3/utils"
import { AppListenerEffectAPI } from "../listener"
import { setStakes } from "../staking"
import {
  accountUsedAsStakingProvider,
  accountSlice,
  fetchingOperatorMapping,
  setMappedOperators,
  fetchingTrm,
  hasFetchedTrm,
  setAccountBlockedStatus,
} from "./slice"
import { fetchWalletScreening } from "../../utils/trmAPI"
import rawBlocklist from "../../blocked-wallets/blocklist.json"

const blocklist = rawBlocklist.map((address: string | null) =>
  address?.toLowerCase()
)

export const getStakingProviderOperatorInfo = async (
  action: ReturnType<typeof setStakes>,
  listenerApi: AppListenerEffectAPI
) => {
  try {
    const { account } = listenerApi.getState()
    const { address } = account
    const stakes = action.payload
    const threshold = listenerApi.extra.threshold

    if (
      !account ||
      !threshold.staking ||
      !threshold.multiAppStaking.ecdsa ||
      !threshold.multiAppStaking.randomBeacon ||
      !threshold.multiAppStaking.taco
    )
      return

    const stake = stakes.find((_: StakeData) =>
      isSameAddress(_.stakingProvider, address)
    )

    let isStakingProvider = false

    if (stake) {
      isStakingProvider = true
    } else {
      const { owner, authorizer, beneficiary } =
        await threshold.staking.rolesOf(address)

      isStakingProvider =
        !isAddressZero(owner) &&
        !isAddressZero(authorizer) &&
        !isAddressZero(beneficiary)
    }

    if (!isStakingProvider) return

    listenerApi.dispatch(fetchingOperatorMapping())

    listenerApi.dispatch(accountUsedAsStakingProvider())

    const mappedOperators =
      await threshold.multiAppStaking.getMappedOperatorsForStakingProvider(
        address
      )

    listenerApi.dispatch(
      setMappedOperators({
        tbtc: mappedOperators.tbtc ?? "",
        randomBeacon: mappedOperators.randomBeacon ?? "",
        taco: mappedOperators.taco ?? "",
      })
    )
  } catch (error: any) {
    listenerApi.dispatch(
      accountSlice.actions.setOperatorMappingError({
        error,
      })
    )
    throw new Error("Could not load staking provider's operator info: " + error)
  }
}

export const getTrmInfo = async (
  action: ReturnType<typeof accountSlice.actions.walletConnected>,
  listenerApi: AppListenerEffectAPI
) => {
  const { address, chainId } = action.payload
  if (!address || !chainId) return

  try {
    listenerApi.dispatch(fetchingTrm())
    const {
      data: { isBlocked },
    } = await fetchWalletScreening({
      address,
      chainId: chainId,
    })

    if (isBlocked) {
      listenerApi.dispatch(setAccountBlockedStatus({ isBlocked }))
    }

    listenerApi.dispatch(hasFetchedTrm())
  } catch (error: any) {
    listenerApi.dispatch(
      accountSlice.actions.setTrmError({
        error,
      })
    )
    throw new Error("Could not load TRM Wallet Screening info: " + error)
  }
}

export const getBlocklistInfo = async (
  action: ReturnType<typeof accountSlice.actions.walletConnected>,
  listenerApi: AppListenerEffectAPI
) => {
  const { address, chainId } = action.payload
  if (!address || !chainId) return

  if (blocklist.includes(address.toLowerCase())) {
    listenerApi.dispatch(setAccountBlockedStatus({ isBlocked: true }))
    return
  }
}
