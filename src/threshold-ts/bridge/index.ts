import { BigNumber } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { EthereumConfig, CrossChainConfig } from "../types"
import { IMulticall } from "../multicall"
import { NetworkContext } from "./context/NetworkContext"

export interface IBridge {
  // Core bridge methods
  withdrawFromBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>
  depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>

  // Approval helpers
  approveForCcip(amount: BigNumber): Promise<TransactionResponse | null>

  // Routing and quotes
  pickPath(amount: BigNumber): Promise<BridgeRoute>
  quoteFees(amount: BigNumber): Promise<BridgeQuote>

  // Utilities
  getLegacyCapRemaining(): Promise<BigNumber>
  canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }>
  getCcipAllowance(): Promise<BigNumber>
  getWithdrawalTime(route: BridgeRoute): number
}

export type BridgeRoute = "ccip" | "standard"

export interface BridgeOptions {
  gasLimit?: BigNumber
  gasPrice?: BigNumber
  maxFeePerGas?: BigNumber
  maxPriorityFeePerGas?: BigNumber
  recipient?: string
  slippage?: number
  deadline?: number
}

export interface BridgeQuote {
  route: BridgeRoute
  fee: BigNumber
  estimatedTime: number // seconds
  breakdown?: {
    ccipAmount?: BigNumber
    standardAmount?: BigNumber
    ccipFee?: BigNumber
    standardFee?: BigNumber
  }
}

export class Bridge implements IBridge {
  private readonly context: NetworkContext

  constructor(ethereumConfig: EthereumConfig) {
    // Create the appropriate context based on the current network
    this.context = new NetworkContext(ethereumConfig)
  }

  /**
   * Withdraws tBTC from Bob network to Ethereum L1.
   * This method can only be called when connected to Bob network.
   *
   * @param {BigNumber} amount - Amount of tBTC to withdraw
   * @param {BridgeOptions} [opts] - Optional transaction parameters
   * @return {Promise<TransactionResponse>} Transaction response
   * @throws Error if not on Bob network
   */
  async withdrawFromBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    return this.context.withdrawFromBob(amount, opts)
  }

  /**
   * Deposits tBTC from Ethereum L1 to Bob network.
   * This method can only be called when connected to Ethereum network.
   *
   * @param {BigNumber} amount - Amount of tBTC to deposit
   * @param {BridgeOptions} [opts] - Optional transaction parameters
   * @return {Promise<TransactionResponse>} Transaction response
   * @throws Error if not on Ethereum network
   */
  async depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    return this.context.depositToBob(amount, opts)
  }

  /**
   * Approves CCIP Router to spend tokens (works on both networks)
   * @param {BigNumber} amount - Amount to approve
   * @return {Promise<TransactionResponse | null>} Transaction response or null if already approved
   */
  async approveForCcip(amount: BigNumber): Promise<TransactionResponse | null> {
    return this.context.approveForCcip(amount)
  }

  /**
   * Determines the optimal withdrawal route (Bob network only)
   * @param {BigNumber} amount - Amount to withdraw
   * @return {Promise<BridgeRoute>} Withdrawal route ("ccip" or "standard")
   * @throws Error if not on Bob network
   */
  async pickPath(amount: BigNumber): Promise<BridgeRoute> {
    return this.context.pickPath(amount)
  }

  /**
   * Quotes fees for withdrawals or deposits
   * @param {BigNumber} amount - Amount to transfer
   * @return {Promise<BridgeQuote>} Fee quote with breakdown
   */
  async quoteFees(amount: BigNumber): Promise<BridgeQuote> {
    return this.context.quoteFees(amount)
  }

  /**
   * Gets the remaining legacy cap (Bob network only)
   * @return {Promise<BigNumber>} Remaining legacy cap
   * @throws Error if not on Bob network
   */
  async getLegacyCapRemaining(): Promise<BigNumber> {
    return this.context.getLegacyCapRemaining()
  }

  /**
   * Checks if amount can be withdrawn (Bob network only)
   * @param {BigNumber} amount - Amount to check
   * @return {Promise<object>} Withdrawal feasibility with canWithdraw, route and reason properties
   * @throws Error if not on Bob network
   */
  async canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }> {
    return this.context.canWithdraw(amount)
  }

  /**
   * Gets CCIP Router allowance (works on both networks)
   * @return {Promise<BigNumber>} Current allowance
   */
  async getCcipAllowance(): Promise<BigNumber> {
    return this.context.getCcipAllowance()
  }

  /**
   * Gets withdrawal time estimate
   * @param {BridgeRoute} route - Route type ("ccip" or "standard")
   * @return {number} Time estimate in seconds
   */
  getWithdrawalTime(route: BridgeRoute): number {
    return this.context.getWithdrawalTime(route)
  }
}

// Re-export types
export { NetworkContext } from "./context/NetworkContext"
