import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useTbtcState } from "../useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "./useTBTCDepositDataFromLocalStorage"
import { useIsActive } from "../useIsActive"
import { useNonEVMConnection } from "../useNonEVMConnection"
import { getEthereumNetworkNameFromChainId } from "../../networks/utils"

export const useRemoveDepositData = () => {
  const { chainId } = useIsActive()
  const { nonEVMChainName } = useNonEVMConnection()
  const { resetDepositData } = useTbtcState()
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()
  const threshold = useThreshold()
  const networkName =
    nonEVMChainName ?? getEthereumNetworkNameFromChainId(chainId)

  return useCallback(() => {
    removeDepositDataFromLocalStorage(networkName)
    resetDepositData()
    threshold.tbtc.removeDepositData()
  }, [resetDepositData, removeDepositDataFromLocalStorage, threshold])
}
