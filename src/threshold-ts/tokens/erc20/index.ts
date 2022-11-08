import { BigNumber, Contract, ContractTransaction } from "ethers"
import { EthereumConfig } from "../../types"
import { getContract } from "../../utils"

export interface IERC20 {
  contract: Contract
  balanceOf: (account: string) => Promise<BigNumber>
  allowance: (owner: string, spender: string) => Promise<BigNumber>
  approve: (spender: string, amount: string) => Promise<ContractTransaction>
  totalSupply: () => Promise<BigNumber>
}

export interface IERC20WithApproveAndCall extends IERC20 {
  approveAndCall: (
    spender: string,
    amount: string,
    extraData: string
  ) => Promise<ContractTransaction>
}

export class BaseERC20Token implements IERC20 {
  protected _contract: Contract

  constructor(config: EthereumConfig, artifact: { abi: any; address: string }) {
    this._contract = getContract(
      artifact.address,
      artifact.abi,
      config.providerOrSigner,
      config.account
    )
  }
  balanceOf = (account: string): Promise<BigNumber> => {
    return this._contract.balanceOf(account)
  }

  allowance = (owner: string, spender: string): Promise<BigNumber> => {
    return this._contract.allowance(owner, spender)
  }

  totalSupply = (): Promise<BigNumber> => {
    return this._contract.totalSupply()
  }

  approve = (spender: string, amount: string): Promise<ContractTransaction> => {
    return this._contract.approve(spender, amount)
  }

  get contract() {
    return this._contract
  }
}

export class ERC20TokenWithApproveAndCall
  extends BaseERC20Token
  implements IERC20WithApproveAndCall
{
  approveAndCall = async (
    spender: string,
    amount: string,
    extraData: string
  ): Promise<ContractTransaction> => {
    return await this._contract.approveAndCall(spender, amount, extraData)
  }
}
