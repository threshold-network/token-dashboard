import TokenStaking from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { BigNumber, Contract, Signer, providers } from "ethers"

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

  constructor(config: { signerOrProvider: Signer | providers.Provider }) {
    this._staking = new Contract(
      TokenStaking.address,
      TokenStaking.abi,
      config.signerOrProvider
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
