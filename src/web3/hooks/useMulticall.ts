import { useCallback } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { ContractCall } from "../../threshold-ts/multicall"

export const useMulticall = (calls: ContractCall[]) => {
  const threshold = useThreshold()

  return useCallback(async () => {
    return await threshold.multicall.aggregate(calls)
  }, [JSON.stringify(calls), threshold])
}
