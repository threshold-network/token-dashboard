import { useCallback } from "react"
import { Contract } from "@ethersproject/contracts"
import { useMulticallContract } from "./useMulticallContract"

interface ContractCall {
  contract: Contract
  method: string
  args?: any[]
}

export const useMulticall = (calls: ContractCall[]) => {
  const multicallContract = useMulticallContract()

  const callRequests = calls.map((_) => [
    _.contract?.address,
    _.contract?.interface.encodeFunctionData(_.method, _.args),
  ])

  return useCallback(async () => {
    if (!multicallContract) {
      return []
    }
    const [, result] = await multicallContract.aggregate(callRequests)
    return result.map((data: string, index: number) => {
      const call = calls[index]
      return call.contract.interface.decodeFunctionResult(call.method, data)
    })
  }, [JSON.stringify(callRequests), multicallContract])
}
