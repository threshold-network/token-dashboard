import React, { FC, useMemo } from "react"
import { Image, ImageProps } from "@threshold-network/components"
import randomBeaconIncrease from "../../static/images/RandomBeaconIncrease.png"
import randomBeaconDecrease from "../../static/images/RandomBeaconDecrease.png"
import tbtcIncrease from "../../static/images/TbtcIncrease.png"
import tbtcDecrease from "../../static/images/TbtcDecrease.png"

// TODO: this can move to somewhere better and combine with any other staking app
//  enums that have been created in other MAS branches
export enum StakingApplication {
  TBTC = "TBTC",
  RANDOM_BEACON = "RANDOM_BEACON",
  PRE = "PRE",
}

const StakingApplicationIcon: FC<
  {
    stakingApplication: StakingApplication
    increaseOrDecrease: "increase" | "decrease"
  } & ImageProps
> = ({ stakingApplication, increaseOrDecrease, ...props }) => {
  const imgSrc = useMemo(() => {
    if (stakingApplication === StakingApplication.TBTC) {
      if (increaseOrDecrease === "increase") {
        return tbtcIncrease
      } else {
        return tbtcDecrease
      }
    }

    if (stakingApplication === StakingApplication.RANDOM_BEACON) {
      if (increaseOrDecrease === "increase") {
        return randomBeaconIncrease
      } else {
        return randomBeaconDecrease
      }
    }
  }, [stakingApplication, increaseOrDecrease])

  return <Image src={imgSrc} {...props} />
}

export default StakingApplicationIcon
