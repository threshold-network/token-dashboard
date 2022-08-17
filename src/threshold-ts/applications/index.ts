import { BigNumber, Contract, ContractInterface } from "ethers"
import { IStaking } from "../staking"

export interface IApplication {
  address: string
  contract: Contract
  authorizedStake(stakingProvider: string): Promise<BigNumber>
  minimumAuthorization(): Promise<BigNumber>
  pendingAuthorizationDecrease(stakingProvider: string): Promise<BigNumber>
  remainingAuthorizationDecreaseDelay(
    stakingProvider: string
  ): Promise<BigNumber>
  authorizationDecreaseDelay(): Promise<BigNumber>
  isEligibleForRewards(): Promise<boolean>
}

export class Application implements IApplication {
  private _application: Contract
  private _staking: IStaking

  constructor(
    staking: IStaking,
    config: { address: string; abi: ContractInterface }
  ) {
    const { address, abi } = config
    this._application = new Contract(address, abi)
    this._staking = staking
  }
  async authorizedStake(stakingProvider: string): Promise<BigNumber> {
    return await this._staking.authorizedStake(
      stakingProvider,
      this._application.address
    )
  }
  minimumAuthorization(): Promise<BigNumber> {
    throw new Error("Method not implemented.")
  }
  pendingAuthorizationDecrease(stakingProvider: string): Promise<BigNumber> {
    throw new Error("Method not implemented.")
  }
  remainingAuthorizationDecreaseDelay(
    stakingProvider: string
  ): Promise<BigNumber> {
    throw new Error("Method not implemented.")
  }
  authorizationDecreaseDelay(): Promise<BigNumber> {
    throw new Error("Method not implemented.")
  }
  isEligibleForRewards(): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  get address() {
    return this._application.address
  }
  get contract() {
    return this._application
  }
}
