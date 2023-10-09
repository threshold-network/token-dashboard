import {
  getStakingAppLabelFromAppAddress,
  getStakingAppLabelFromAppName,
  getStakingAppNameFromAppAddress,
} from "../getStakingAppLabel"
import { StakingAppName } from "../../store/staking-applications"
import { getThresholdLib } from "../getThresholdLib"

const MOCK_ADDRESSES: Record<StakingAppName, string> = {
  tbtc: getThresholdLib().multiAppStaking.ecdsa.address,
  randomBeacon: getThresholdLib().multiAppStaking.randomBeacon.address,
}
const MOCK_LABELS: Record<StakingAppName, string> = {
  tbtc: "tBTC",
  randomBeacon: "Random Beacon",
}
const MOCK_APP_NAMES: StakingAppName[] = ["tbtc", "randomBeacon"]

describe("Staking app label utils tests", () => {
  const [tbtcName, rbName] = MOCK_APP_NAMES
  const tbtcAddress = MOCK_ADDRESSES[tbtcName]
  const rbAddress = MOCK_ADDRESSES[rbName]

  it("returns correct app label if app address is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppAddress(tbtcAddress)
    const resultRbLabel = getStakingAppLabelFromAppAddress(rbAddress)

    expect(resultTbtcLabel).toBe(MOCK_LABELS[tbtcName])
    expect(resultRbLabel).toBe(MOCK_LABELS[rbName])
  })

  it("returns correct app label if app name is given", () => {
    const resultTbtcLabel = getStakingAppLabelFromAppName(tbtcName)
    const resultRbLabel = getStakingAppLabelFromAppName(rbName)

    expect(resultTbtcLabel).toBe(MOCK_LABELS[tbtcName])
    expect(resultRbLabel).toBe(MOCK_LABELS[rbName])
  })

  it("returns correct app name if address is given", () => {
    const resultTbtcName = getStakingAppNameFromAppAddress(tbtcAddress)
    const resultRbName = getStakingAppNameFromAppAddress(rbAddress)

    expect(resultTbtcName).toBe(tbtcName)
    expect(resultRbName).toBe(rbName)
  })
})
