import {
  getStakingAppLabelFromAppAddress,
  getStakingAppLabelFromAppName,
  getStakingAppNameFromAppAddress,
} from "../getStakingAppLabel"
import { StakingAppName } from "../../store/staking-applications"
import { getThresholdLib } from "../getThresholdLib"

const thresholdLib = getThresholdLib()

const mockAddresses: Record<StakingAppName, string> = {
  tbtc: thresholdLib.multiAppStaking.ecdsa.address,
  randomBeacon: thresholdLib.multiAppStaking.randomBeacon.address,
  taco: thresholdLib.multiAppStaking.taco.address,
}
const mockLabels: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
  taco: "TACo",
}
const mockAppNames: StakingAppName[] = ["tbtc", "randomBeacon", "taco"]

describe("Staking app label utils tests", () => {
  const [tbtcName, randomBeaconName, tacoName] = mockAppNames
  const tbtcAddress = mockAddresses[tbtcName]
  const randomBeaconAddress = mockAddresses[randomBeaconName]
  const tacoAddress = mockAddresses[tacoName]

  it.skip("returns correct app label if app address is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppAddress(
      tbtcAddress,
      thresholdLib
    )
    const resultRandomBeaconLabel = getStakingAppLabelFromAppAddress(
      randomBeaconAddress,
      thresholdLib
    )
    const resultTacoLabel = getStakingAppLabelFromAppAddress(
      tacoAddress,
      thresholdLib
    )

    expect(resultTbtcLabel).toBe(mockLabels[tbtcName])
    expect(resultRandomBeaconLabel).toBe(mockLabels[randomBeaconName])
    expect(resultTacoLabel).toBe(mockLabels[tacoName])
  })

  it("returns correct app label if app name is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppName(tbtcName)
    const resultRbLabel = getStakingAppLabelFromAppName(randomBeaconName)
    const resultTacoLabel = getStakingAppLabelFromAppName(tacoName)

    expect(resultTbtcLabel).toBe(mockLabels[tbtcName])
    expect(resultRbLabel).toBe(mockLabels[randomBeaconName])
    expect(resultTacoLabel).toBe(mockLabels[tacoName])
  })

  it.skip("returns correct app name if address is given", () => {
    const resultTbtcName = getStakingAppNameFromAppAddress(
      tbtcAddress,
      thresholdLib
    )
    const resultRbName = getStakingAppNameFromAppAddress(
      randomBeaconAddress,
      thresholdLib
    )
    const resultTacoName = getStakingAppNameFromAppAddress(
      tacoAddress,
      thresholdLib
    )

    expect(resultTbtcName).toBe(tbtcName)
    expect(resultRbName).toBe(randomBeaconName)
    expect(resultTacoName).toBe(tacoName)
  })
})
