import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { BigNumber, BigNumberish, Contract } from "ethers"
import { EthereumConfig } from "../types"
import { getContract, STANDARD_ERC20_DECIMALS } from "../utils"
/**
 * An interface representing the T token amount and the reminder that can't be
 * upgraded.
 */
export interface ConversionToT<NumberType extends BigNumberish = BigNumber> {
  /**
   * The amount of T tokens obtained from the amount of wrapped tokens.
   */
  tAmount: NumberType
  /**
   * Amount of wrapped token that can't be upgraded.
   */
  wrappedRemainder: NumberType
}

/**
 * Interface of update protocol to enable KEEP/NU token holders to wrap their
 * tokens and obtain T tokens according to a fixed ratio.
 */
export interface IVendingMachine {
  /**
   * Number of decimal places of precision in conversion to/from wrapped tokens
   * (assuming typical ERC20 token with 18 decimals). This implies that amounts
   * of wrapped tokens below this precision won't take part in the conversion.
   * E.g., for a value of 3, then for a conversion of 1.123456789 wrapped
   * tokens, only 1.123 is convertible (i.e., 3 decimal places), and 0.000456789
   * is left.
   */
  WRAPPED_TOKEN_CONVERSION_PRECISION: number

  /**
   * Divisor for precision purposes, used to represent fractions.
   */
  FLOATING_POINT_DIVISOR: BigNumber

  /**
   * Ethers contract instance of the `VendingMachine` contract.
   */
  contract: Contract

  /**
   * Returns the T token amount that's obtained from `amount` wrapped tokens,
   * and the remainder that can't be upgraded.
   * @param amount Amount of the wrapped token to convert to T.
   * @returns Object representing the T token amount and the reminder that can't
   * be upgraded @see {@link ConversionToT}
   */
  convertToT(amount: string): Promise<ConversionToT>

  /**
   * @returns The ratio with which T token is converted based on the provided
   * token being wrapped, expressed in 1e18 precision.
   */
  ratio(): Promise<BigNumber>
}

/**
 * Interface of vending machines in T network. There is a separate instance of
 * the vending machine for KEEP holders and a separate instance of the vending
 * machine for NU holders.
 */
export interface IVendingMachines {
  nu: IVendingMachine
  keep: IVendingMachine
}

export class VendingMachine implements IVendingMachine {
  private _vendingMachine: Contract
  private _ratio?: BigNumber
  public readonly WRAPPED_TOKEN_CONVERSION_PRECISION = 3
  public readonly FLOATING_POINT_DIVISOR = BigNumber.from(10).pow(
    BigNumber.from(
      STANDARD_ERC20_DECIMALS - this.WRAPPED_TOKEN_CONVERSION_PRECISION
    )
  )

  constructor(config: EthereumConfig, artifact: { abi: any; address: string }) {
    this._vendingMachine = getContract(
      artifact.address,
      artifact.abi,
      config.providerOrSigner,
      config.account
    )
  }

  get contract() {
    return this._vendingMachine
  }

  ratio = async (): Promise<BigNumber> => {
    if (!this._ratio) {
      this._ratio = await this._vendingMachine.ratio()
    }

    return this._ratio!
  }

  convertToT = async (amount: string): Promise<ConversionToT> => {
    const wrappedRemainder = BigNumber.from(amount).mod(
      this.FLOATING_POINT_DIVISOR
    )
    const convertibleAmount = BigNumber.from(amount).sub(wrappedRemainder)

    return {
      tAmount: convertibleAmount
        .mul(BigNumber.from(await this.ratio()))
        .div(this.FLOATING_POINT_DIVISOR),
      wrappedRemainder,
    }
  }
}

export class VendingMachines implements IVendingMachines {
  public readonly nu: IVendingMachine
  public readonly keep: IVendingMachine

  constructor(config: EthereumConfig) {
    this.nu = new VendingMachine(config, VendingMachineNuCypher)
    this.keep = new VendingMachine(config, VendingMachineKeep)
  }
}
