import { Contract } from "ethers"
import MerkleDropContractABI from "./abi.json"
import { AddressZero, getContract } from "../../utils"
import { EthereumConfig } from "../../types"

// TODO: Move to a separate package `contract`. We should create a contract
// wrapper for each contract the threshold lib integrates to keep the same
// interface. In some cases multiple services need the same contract data like
// deployment block or address.
export interface IContract<ContractInstance> {
  deploymentBlock: number
  instance: ContractInstance
  address: string
}

const CONTRACT_ADDRESSESS = {
  // https://etherscan.io/address/0xea7ca290c7811d1cc2e79f8d706bd05d8280bd37
  1: "0xeA7CA290c7811d1cC2e79f8d706bD05d8280BD37",
  // https://goerli.etherscan.io/address/0x55F836777302CE096CC7770142a8262A2627E2e9
  5: "0x55F836777302CE096CC7770142a8262A2627E2e9",
  // TODO: Set local address- how to resolve it in local network?
  1337: AddressZero,
} as Record<string, string>

export class MerkleDropContract implements IContract<Contract> {
  private readonly _instance: Contract
  private readonly _deploymentBlock: number

  constructor(config: EthereumConfig) {
    const address = CONTRACT_ADDRESSESS[config.chainId]
    if (!address) {
      throw new Error("Unsupported chain id")
    }

    this._instance = getContract(
      address,
      MerkleDropContractABI,
      config.providerOrSigner,
      config.account
    )
    this._deploymentBlock = config.chainId === 1 ? 15146501 : 0
  }
  get deploymentBlock() {
    return this._deploymentBlock
  }

  get instance() {
    return this._instance
  }

  get address() {
    return this._instance.address
  }
}
