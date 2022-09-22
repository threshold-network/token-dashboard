import { useWeb3React } from "@web3-react/core"
import { isAddressZero, isSameETHAddress } from "../../web3/utils"
import { useOperatorsMappedToStakingProvider } from "./useOperatorsMappedToStakingProvider"

export interface OperatorMappedToStakingProviderHelpers {
  operatorMappedRandomBeacon: string
  operatorMappedTbtc: string
  isOperatorMappedOnlyInTbtc: boolean
  isOperatorMappedOnlyInRandomBeacon: boolean
}

export const useOperatorMappedtoStakingProviderHelpers: () => OperatorMappedToStakingProviderHelpers =
  () => {
    const { account } = useWeb3React()
    const operatorMappedRandomBeacon =
      useOperatorsMappedToStakingProvider("randomBeacon")
    const operatorMappedTbtc = useOperatorsMappedToStakingProvider("tbtc")

    const isOperatorMappedOnlyInTbtc =
      isAddressZero(operatorMappedRandomBeacon) &&
      !isAddressZero(operatorMappedTbtc)
    const isOperatorMappedOnlyInRandomBeacon =
      !isAddressZero(operatorMappedRandomBeacon) &&
      isAddressZero(operatorMappedTbtc)

    return {
      operatorMappedRandomBeacon,
      operatorMappedTbtc,
      isOperatorMappedOnlyInTbtc,
      isOperatorMappedOnlyInRandomBeacon,
    }
  }
