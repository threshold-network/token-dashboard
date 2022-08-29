import { useCallback } from "react"
import { Contract } from "@ethersproject/contracts"
import { useThreshold } from "../../contexts/ThresholdContext"

interface ContractCall {
  contract: Contract
  method: string
  args?: any[]
}

export const useMulticall = (calls: ContractCall[]) => {
  const threshold = useThreshold()

  return useCallback(async () => {
    return await threshold.multicall.aggregate(calls)
  }, [JSON.stringify(calls), threshold])
}
