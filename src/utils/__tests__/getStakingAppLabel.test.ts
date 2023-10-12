import {
  getStakingAppLabelFromAppAddress,
  getStakingAppLabelFromAppName,
  getStakingAppNameFromAppAddress,
} from "../getStakingAppLabel"
import { StakingAppName } from "../../store/staking-applications"
import { getThresholdLib } from "../getThresholdLib"

const mockAddresses: Record<StakingAppName, string> = {
  tbtc: getThresholdLib().multiAppStaking.ecdsa.address,
  randomBeacon: getThresholdLib().multiAppStaking.randomBeacon.address,
}
const mockLabels: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
}
const mockAppNames: StakingAppName[] = ["tbtc", "randomBeacon"]

describe("Staking app label utils tests", () => {
  const [tbtcName, randomBeaconName] = mockAppNames
  const tbtcAddress = mockAddresses[tbtcName]
  const randomBeaconAddress = mockAddresses[randomBeaconName]

  it("returns correct app label if app address is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppAddress(tbtcAddress)
    const resultRandomBeaconLabel =
      getStakingAppLabelFromAppAddress(randomBeaconAddress)

    expect(resultTbtcLabel).toBe(mockLabels[tbtcName])
    expect(resultRandomBeaconLabel).toBe(mockLabels[randomBeaconName])
  })

  it("returns correct app label if app name is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppName(tbtcName)
    const resultRandomBeaconLabel =
      getStakingAppLabelFromAppName(randomBeaconName)

    expect(resultTbtcLabel).toBe(mockLabels[tbtcName])
    expect(resultRandomBeaconLabel).toBe(mockLabels[randomBeaconName])
  })

  it("returns correct app name if address is given", () => {
    const resultTbtcName = getStakingAppNameFromAppAddress(tbtcAddress)
    const resultRandomBeaconName =
      getStakingAppNameFromAppAddress(randomBeaconAddress)

    expect(resultTbtcName).toBe(tbtcName)
    expect(resultRandomBeaconName).toBe(randomBeaconName)
  })
})
