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
