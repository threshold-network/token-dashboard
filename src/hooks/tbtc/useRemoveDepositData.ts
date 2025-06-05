import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useTbtcState } from "../useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "./useTBTCDepositDataFromLocalStorage"
import { useIsActive } from "../useIsActive"
import { useNonEVMConnection } from "../useNonEVMConnection"
import { getStarkNetConfig } from "../../utils/tbtcStarknetHelpers"

export const useRemoveDepositData = () => {
  const { chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName } = useNonEVMConnection()
  const { resetDepositData } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()
  const threshold = useThreshold()

  // For StarkNet connections, use the StarkNet chain ID
  const effectiveChainId =
    chainId ||
    (isNonEVMActive && nonEVMChainName === "Starknet"
      ? getStarkNetConfig().chainId
      : undefined)

  return useCallback(() => {
    removeDepositDataFromLocalStorage(effectiveChainId)
    resetDepositData()
    threshold.tbtc.removeDepositData()
  }, [
    resetDepositData,
    removeDepositDataFromLocalStorage,
    threshold,
    effectiveChainId,
  ])
}
