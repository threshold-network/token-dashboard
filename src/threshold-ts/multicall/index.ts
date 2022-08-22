import { Contract } from "ethers"
import { EthereumConfig } from "../types"
import { AddressZero, getContract } from "../utils"

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
const MULTICALL_ADDRESSESS = {
  1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  5: "0x77dca2c955b15e9de4dbbcf1246b4b85b651e50e",
  1337: process.env.REACT_APP_MULTICALL_ADDRESS || AddressZero,
} as Record<number | string, string>

export class Multicall implements IMulticall {
  private _multicall: Contract

  constructor(config: EthereumConfig) {
    const address = MULTICALL_ADDRESSESS[config.chainId]
    if (!address) {
      throw new Error("Unsupported chain id")
    }

    this._multicall = getContract(
      address,
      MULTICALL_ABI,
      config.providerOrSigner
    )
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
