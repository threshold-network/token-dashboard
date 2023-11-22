import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useTbtcState } from "../useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "./useTBTCDepositDataFromLocalStorage"

export const useRemoveDepositData = () => {
  const { resetDepositData } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()
  const threshold = useThreshold()

  return useCallback(() => {
    removeDepositDataFromLocalStorage()
    resetDepositData()
    threshold.tbtc.removeDepositData()
  }, [resetDepositData, removeDepositDataFromLocalStorage, threshold])
}
