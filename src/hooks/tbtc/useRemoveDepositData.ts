import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useTbtcState } from "../useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "./useTBTCDepositDataFromLocalStorage"
import { useIsActive } from "../useIsActive"

export const useRemoveDepositData = () => {
  const { chainId } = useIsActive()
  const { resetDepositData } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()
  const threshold = useThreshold()

  return useCallback(() => {
    removeDepositDataFromLocalStorage(chainId)
    resetDepositData()
    threshold.tbtc.removeDepositData()
  }, [resetDepositData, removeDepositDataFromLocalStorage, threshold])
}
