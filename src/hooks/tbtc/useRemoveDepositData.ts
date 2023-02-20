import { useCallback } from "react"
import { useTbtcState } from "../useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "./useTBTCDepositDataFromLocalStorage"

export const useRemoveDepositData = () => {
  const { resetDepositData } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()

  return useCallback(() => {
    removeDepositDataFromLocalStorage()
    resetDepositData()
  }, [resetDepositData, removeDepositDataFromLocalStorage])
}
