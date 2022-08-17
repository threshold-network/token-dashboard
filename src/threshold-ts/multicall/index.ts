import { Contract } from "ethers"

interface ContractCall {
  contract: Contract
  method: string
  args?: any[]
}

export interface IMulticall {
  aggregate(calls: ContractCall[]): Promise<any>
}

const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
]

export class Multicall implements IMulticall {
  private _multicall: Contract

  constructor(config: { address: string }) {
    this._multicall = new Contract(config.address, MULTICALL_ABI)
  }

  async aggregate(calls: ContractCall[]): Promise<any[]> {
    const callRequests = calls.map((_) => [
      _.contract.address,
      _.contract.interface.encodeFunctionData(_.method, _.args),
    ])

    const [, result] = await this._multicall.aggregate(callRequests)

    return result.map((data: string, index: number) => {
      const call = calls[index]
      return call.contract.interface.decodeFunctionResult(call.method, data)
    })
  }
}
