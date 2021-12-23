import { AddressZero } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"
import { useCallback } from "react"
import { useContract } from "./useContract"

const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
]

// Addresses exported from:
// https://github.com/makerdao/multicall#multicall-contract-addresses
const MULTICALL_ADDRESSESS = {
  1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  3: "0x53c43764255c17bd724f74c4ef150724ac50a3ed",
  1337: process.env.REACT_APP_MULTICALL_ADDRESS || AddressZero,
}

interface ContractCall {
  contract: Contract
  method: string
  args: any[]
}

export const useMulticall = (calls: ContractCall[]) => {
  const multicallContract = useContract(
    // TODO: Get the chain id from env.
    MULTICALL_ADDRESSESS["1337"],
    MULTICALL_ABI
  )

  const callRequests = calls.map((_) => [
    _.contract?.address,
    _.contract?.interface.encodeFunctionData(_.method, _.args),
  ])

  return useCallback(async () => {
    const [, result] = await multicallContract?.aggregate(callRequests)
    return result.map((data: string, index: number) => {
      const call = calls[index]
      return call.contract.interface.decodeFunctionResult(call.method, data)
    })
  }, [JSON.stringify(callRequests), multicallContract])
}
