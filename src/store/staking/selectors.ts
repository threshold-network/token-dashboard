import { createSelector } from "@reduxjs/toolkit"
import { BigNumber } from "ethers"
import { ZERO, max } from "../../threshold-ts/utils"
import { RootState } from ".."
import { StakeData } from "../../types/staking"
import { isSameETHAddress } from "../../web3/utils"
import { selectStakingAppByStakingProvider } from "../staking-applications/selectors"

export const selectStakes = (state: RootState) => state.staking.stakes

export const selectStakingProviders = createSelector(selectStakes, (stakes) =>
  stakes.map((_) => _.stakingProvider)
)
export const selectStakeByStakingProvider = createSelector(
  [selectStakes, (_: RootState, stakingProvider: string) => stakingProvider],
  (stakes: StakeData[], stakingProvider: string) =>
    stakes.find((_) => isSameETHAddress(_.stakingProvider, stakingProvider))
)

// This selector returns available amount to unstake for T, KEEP and NU in T
// denomination. The maximum unstake amount depends on the authorized apps for
// example suppose the given staking provider has 10T, 20T worth of KEEP and 30
// T worth of NU- all staked. The maximum application authorization is 40 T,
// then the maximum available amount to unstake is:
// - 10T from T stake because: 10T(T stake) - max(0, 40T(authorization) -
//   20T(KEEP stake) - 30T(NU stake)) = 10,
// - 20T from KEEP stake because: 20T(KEEP stake) - max(0, 40T(authorization) -
//   30T(NU stake) - 10T(T stake)) = 20,
// - 20T from NU stake because: 30T(NU stake) - max(0, 40T(authorization) -
//   20T(KEEP stake) -10T(T stake)) = 20,
// - An owner can't unstake all stake(KEEP+NU+T) because has authorized
//   applications. To unstake all the staking provider cannot have any
//   authorized apps.
// In other words, the minimum stake amount for the specified stake type is the
// minimum amount of stake of the given type needed to satisfy the maximum
// application authorization given the staked amounts of the other stake types
// for that staking provider.
export const selectAvailableAmountToUnstakeByStakingProvider = createSelector(
  [
    (state: RootState, stakingProvider: string) =>
      selectStakeByStakingProvider(state, stakingProvider),
    (state: RootState, stakingProvider: string) =>
      selectStakingAppByStakingProvider(state, "tbtc", stakingProvider),
    (state: RootState, stakingProvider: string) =>
      selectStakingAppByStakingProvider(state, "randomBeacon", stakingProvider),
  ],
  (
    stake: StakeData | undefined,
    tbtcAppData: ReturnType<typeof selectStakingAppByStakingProvider>,
    randomBeaconAppData: ReturnType<typeof selectStakingAppByStakingProvider>
  ) => {
    if (stake === undefined) {
      return {
        nuInT: "0",
        keepInT: "0",
        t: "0",
        canUnstakeAll: false,
      }
    }

    const maxAuthorization = max(
      tbtcAppData.authorizedStake || ZERO,
      randomBeaconAppData.authorizedStake || ZERO
    )

    const isZeroAuthorization = maxAuthorization.isZero()

    const nuInTMinStake = max(
      ZERO,
      maxAuthorization.sub(stake.tStake).sub(stake.keepInTStake).toString()
    )

    const tMinStake = max(
      ZERO,
      maxAuthorization.sub(stake.nuInTStake).sub(stake.keepInTStake).toString()
    )

    const keepInTMinStake = max(
      ZERO,
      maxAuthorization.sub(stake.nuInTStake).sub(stake.tStake).toString()
    )

    return {
      nuInT: isZeroAuthorization
        ? stake.nuInTStake
        : BigNumber.from(stake.nuInTStake).sub(nuInTMinStake).toString(),
      keepInT:
        isZeroAuthorization || BigNumber.from(keepInTMinStake).isZero()
          ? stake.keepInTStake
          : "0",
      t: isZeroAuthorization
        ? stake.tStake
        : BigNumber.from(stake.tStake).sub(tMinStake).toString(),
      // You can unstake all (T + KEEP + NU) only if there are no
      // authorized apps.
      canUnstakeAll: isZeroAuthorization,
    }
  }
)
