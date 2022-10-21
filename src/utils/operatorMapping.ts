import { isAddressZero } from "../web3/utils"

export const extractOperatorMappingAdditionalData = (
  mappedOperatorTbtc: string,
  mappedOperatorRandomBeacon: string
): {
  isOperatorMappedOnlyInTbtc: boolean
  isOperatorMappedOnlyInRandomBeacon: boolean
  isOneOfTheAppsNotMapped: boolean
  isOperatorMappedInBothApps: boolean
} => {
  const isOperatorMappedOnlyInTbtc =
    !isAddressZero(mappedOperatorTbtc) &&
    isAddressZero(mappedOperatorRandomBeacon)

  const isOperatorMappedOnlyInRandomBeacon =
    isAddressZero(mappedOperatorTbtc) &&
    !isAddressZero(mappedOperatorRandomBeacon)

  const isOperatorMappedInBothApps =
    !isAddressZero(mappedOperatorRandomBeacon) &&
    !isAddressZero(mappedOperatorTbtc)

  return {
    isOperatorMappedOnlyInTbtc: !isAddressZero(mappedOperatorTbtc),
    isOperatorMappedOnlyInRandomBeacon,
    isOneOfTheAppsNotMapped:
      isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc,
    isOperatorMappedInBothApps,
  }
}
