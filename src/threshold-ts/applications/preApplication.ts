import {
  Contract,
  BigNumber,
  BigNumberish,
  ContractTransaction,
  ContractInterface,
} from "ethers"
import { AuthorizationParameters, StakingProviderAppInfo } from "."
import { IMulticall } from "../multicall"
import { IStaking } from "../staking"
import { EthereumConfig } from "../types"
import { getContract, isAddressZero } from "../utils"

export interface PREStakingProviderInfo {
  /**
   * Operator address mapped to a given staking provider
   */
  operator: string
  /**
   * Info if operator is confirmed
   */
  operatorConfirmed: boolean
  /**
   * Timestamp where operator were bonded
   */
  operatorStartTimestamp: Number
}

export interface IPREApplication {
  /**
   * Application address.
   */
  address: string

  /**
   * Application contract.
   */
  contract: Contract

  /**
   * Checks if the operator for the given staking provider is mapped
   * @param stakingProvider Staking provider address
   * @returns boolean value which informs if operator is mapped for the given
   * staking provider
   */
  isOperatorMapped(stakingProvider: string): Promise<boolean>

  // /**
  //  * Copied from:
  //  * https://github.com/nucypher/nucypher/blob/development/nucypher/blockchain/eth/sol/source/contracts/SimplePREApplication.sol#L172-L176
  //  *
  //  * Bond operator
  //  * @param stakingProvider Staking provider address
  //  * @param operator Operator address. Must be a real address, not a contract
  //  */
  // bondOperator(
  //   stakingProvider: string,
  //   operator: string
  // ): Promise<ContractTransaction>

  // /**
  //  * Copied from:
  //  * https://github.com/nucypher/nucypher/blob/development/nucypher/blockchain/eth/sol/source/contracts/SimplePREApplication.sol#L213-L215
  //  *
  //  * Make a confirmation by operator
  //  */
  // confirmOperatorAddress(): Promise<ContractTransaction>

  /**
   * Used to get a registered operator mapped to the given staking provider
   * @param stakingProvider Staking provider address
   */
  stakingProviderToOperator(stakingProvider: string): Promise<string>

  /**
   * Used to get staking provider address mapped to the given registered
   * operator address
   * @param operator Operator address
   */
  operatorToStakingProvider(operator: string): Promise<string>
}

export class PREApplication implements IPREApplication {
  private _application: Contract
  // private _staking: IStaking
  private _multicall: IMulticall

  constructor(
    multicall: IMulticall,
    config: EthereumConfig & { address: string; abi: ContractInterface }
  ) {
    const { address, abi, providerOrSigner, account } = config
    this._application = getContract(address, abi, providerOrSigner, account)
    this._multicall = multicall
  }

  get address() {
    return this._application.address
  }
  get contract() {
    return this._application
  }

  isOperatorMapped = async (stakingProvider: string): Promise<boolean> => {
    const { operator, operatorConfirmed } =
      await this._application.stakingProviderInfo(stakingProvider)

    return !isAddressZero(operator) && operatorConfirmed
  }

  stakingProviderToOperator(stakingProvider: string): Promise<string> {
    return this._application.getOperatorFromStakingProvider(stakingProvider)
  }

  operatorToStakingProvider(operator: string): Promise<string> {
    return this._application.stakingProviderFromOperator(operator)
  }
}
