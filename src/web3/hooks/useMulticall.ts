import { useCallback } from "react"
import { useMulticallContract } from "./useMulticallContract"
import { ContractCall } from "../../threshold-ts/multicall"

export const useMulticall = (calls: ContractCall[]) => {
  const multicall = useMulticallContract()

  return useCallback(async () => {
    if (!multicall) return []

    const callRequests = calls.map((_) => [
      _.address,
      _.interface.encodeFunctionData(_.method, _.args),
    ])

    const [, result] = await multicall.aggregate(callRequests)

    return result.map((data: string, index: number) => {
      const call = calls[index]
      return call.interface.decodeFunctionResult(call.method, data)
    })
  }, [JSON.stringify(calls), multicall])
}
