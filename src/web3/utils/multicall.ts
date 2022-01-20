import { Contract } from "@ethersproject/contracts"

export interface ContractCall {
  contract: Contract
  method: string
  args?: any[]
}

export const getMulticallContractCall = (call: ContractCall) => {
  return [
    call.contract?.address,
    call.contract?.interface.encodeFunctionData(call.method, call.args),
  ]
}

export const decodeMulticallResult = (
  result: string[],
  calls: ContractCall[]
) => {
  return result.map((data: string, index: number) => {
    const call = calls[index]
    return call.contract.interface.decodeFunctionResult(call.method, data)
  })
}
