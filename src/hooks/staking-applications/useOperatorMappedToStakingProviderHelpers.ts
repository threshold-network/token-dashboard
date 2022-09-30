import { useWeb3React } from "@web3-react/core"
import { isAddressZero, isSameETHAddress } from "../../web3/utils"
import { useOperatorsMappedToStakingProvider } from "./useOperatorsMappedToStakingProvider"
import { useStakingApplicationState } from "./useStakingApplicationState"

export interface OperatorMappedToStakingProviderHelpers {
  operatorMappedRandomBeacon: string
  operatorMappedTbtc: string
  isOperatorMappedOnlyInTbtc: boolean
  isOperatorMappedOnlyInRandomBeacon: boolean
  isInitialFetchDone: boolean
}

export const useOperatorMappedtoStakingProviderHelpers: () => OperatorMappedToStakingProviderHelpers =
  () => {
    const operatorMappedRandomBeacon =
      useOperatorsMappedToStakingProvider("randomBeacon")
    const operatorMappedTbtc = useOperatorsMappedToStakingProvider("tbtc")
    const isInitiallyFetchedRandomBeacon =
      useStakingApplicationState("randomBeacon").mappedOperator
        .isInitialFetchDone
    const isInitiallyFetchedTbtc =
      useStakingApplicationState("tbtc").mappedOperator.isInitialFetchDone

    const isOperatorMappedOnlyInTbtc =
      isAddressZero(operatorMappedRandomBeacon) &&
      !isAddressZero(operatorMappedTbtc)
    const isOperatorMappedOnlyInRandomBeacon =
      !isAddressZero(operatorMappedRandomBeacon) &&
      isAddressZero(operatorMappedTbtc)

    const isInitialFetchDone =
      !!isInitiallyFetchedRandomBeacon && !!isInitiallyFetchedTbtc

    return {
      operatorMappedRandomBeacon,
      operatorMappedTbtc,
      isOperatorMappedOnlyInTbtc,
      isOperatorMappedOnlyInRandomBeacon,
      isInitialFetchDone,
    }
  }
