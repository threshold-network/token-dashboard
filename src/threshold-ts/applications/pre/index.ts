import { BigNumber, Contract, Event } from "ethers"
import SimplePREApplicationABI from "./abi.json"
import {
  AddressZero,
  isAddressZero,
  getContract,
  getContractPastEvents,
} from "../../utils"
import { EthereumConfig } from "../../types"

export const PRE_ADDRESSESS = {
  // https://etherscan.io/address/0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd
  1: "0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd",
  // https://goerli.etherscan.io/address/0x829fdCDf6Be747FEA37518fBd83dF70EE371fCf2
  // As NuCypher hasn't depoyed the `SimplePreApplication` contract on Goerli,
  // we're using a stub contract.
  5: "0x829fdCDf6Be747FEA37518fBd83dF70EE371fCf2",
  // Set the correct `SimplePREApplication` contract address. If you deployed
  // the `@threshold-network/solidity-contracts` to your local chain and linked
  // package using `yarn link @threshold-network/solidity-contracts` you can
  // find the contract address at
  // `node_modules/@threshold-network/solidity-contracts/artifacts/SimplePREApplication.json`.
  1337: AddressZero,
} as Record<string, string>

export interface StakingProviderInfo {
  /**
   * Operator address mapped to a given staking provider/
   */
  operator: string
  /**
   * Determines if the operator is confirmed.
   */
  isOperatorConfirmed: boolean
  /**
   * Timestamp where operator were bonded.
   */
  operatorStartTimestamp: string
  /**
   * Determines if the operator for the given staking provider is
   * mapped.
   */
  isOperatorMapped: boolean
}

// NOTE: The simple PRE application contract doesn't implement the application
// interface so we can't use the same interface as for the Keep staking apps.
export interface IPRE {
  /**
   * Application address.
   */
  address: string

  /**
   * Application contract.
   */
  contract: Contract

  deploymentBlock: number

  getStakingProviderAppInfo: (
    stakingProvider: string
  ) => Promise<StakingProviderInfo>

  getOperatorConfirmedEvents: (
    stakingProvider?: string | string[],
    operator?: string | string[]
  ) => Promise<Event[]>
}

export class PRE implements IPRE {
  private _application: Contract
  private readonly _deploymentBlock: number

  constructor(config: EthereumConfig) {
    const address = PRE_ADDRESSESS[config.chainId]
    if (!address) {
      throw new Error("Unsupported chain id")
    }

    this._application = getContract(
      address,
      SimplePREApplicationABI,
      config.providerOrSigner,
      config.account
    )
    this._deploymentBlock = config.chainId === 1 ? 14141140 : 0
  }
  getStakingProviderAppInfo = async (
    stakingProvider: string
  ): Promise<StakingProviderInfo> => {
    const operatorInfo = (await this._application.stakingProviderInfo(
      stakingProvider
    )) as {
      operator: string
      operatorConfirmed: boolean
      operatorStartTimestamp: BigNumber
    }

    return {
      operator: operatorInfo.operator,
      isOperatorConfirmed: operatorInfo.operatorConfirmed,
      operatorStartTimestamp: operatorInfo.operatorStartTimestamp.toString(),
      isOperatorMapped:
        !isAddressZero(operatorInfo.operator) && operatorInfo.operatorConfirmed,
    }
  }

  get address() {
    return this._application.address
  }
  get contract() {
    return this._application
  }

  get deploymentBlock() {
    return this._deploymentBlock
  }

  getOperatorConfirmedEvents = async (
    stakingProvider?: string | string[],
    operator?: string | string[]
  ): Promise<Event[]> => {
    return await getContractPastEvents(this._application, {
      eventName: "OperatorConfirmed",
      fromBlock: this._deploymentBlock,
      filterParams: [stakingProvider, operator],
    })
  }
}
