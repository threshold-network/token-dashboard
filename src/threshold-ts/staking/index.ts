import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { BigNumber, Contract } from "ethers"
import { EthereumConfig } from "../types"
import { getContract } from "../utils"

export interface IStaking {
  stakingContract: Contract
  authorizedStake(
    stakingProvider: string,
    application: string
  ): Promise<BigNumber>

  // TODO: move other functions here eg fetching all owner stakes.
}

export class Staking implements IStaking {
  private _staking: Contract

  constructor(config: EthereumConfig) {
    this._staking = getContract(
      TokenStaking.address,
      TokenStaking.abi,
      config.providerOrSigner
    )
  }

  async authorizedStake(
    stakingProvider: string,
    application: string
  ): Promise<BigNumber> {
    return this._staking.authorizedStake(stakingProvider, application)
  }

  get stakingContract() {
    return this._staking
  }
}
