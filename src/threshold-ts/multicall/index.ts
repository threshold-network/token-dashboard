import { Contract } from "ethers"
import { EthereumConfig } from "../types"
import { AddressZero, getContract } from "../utils"

export interface ContractCall {
  contract: Contract
  method: string
  args?: any[]
}

/**
 * Represents a multicall contract wrapper. @see
 * {@link https://github.com/makerdao/multicall#multicall}
 */
export interface IMulticall {
  /**
   * Allows multiple smart contract constant function calls to be grouped into a
   * single call and the results aggregated into a single result. This reduces
   * the number of separate JSON RPC requests that need to be sent.
   * @param calls An array of contract calls represented by @see
   * {@link ContractCall}.
   * @returns Contract calls results aggregated into a single result.
   */
  aggregate(calls: ContractCall[]): Promise<any[]>
}

export const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
]
export const MULTICALL_ADDRESSESS = {
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
