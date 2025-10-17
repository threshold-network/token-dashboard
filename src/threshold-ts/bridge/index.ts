import { BigNumber, Event } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { EthereumConfig, CrossChainConfig } from "../types"
import { NetworkContext } from "./context/NetworkContext"
import { BridgeActivityFetcher } from "./bridgeActivityFetcher"

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
  getBridgingTime(route: BridgeRoute): number
  getContext(): NetworkContext
  fetchBridgeActivities(
    account: string,
    fromBlock?: number | string
  ): Promise<BridgeActivity[]>
}

export type BridgeRoute = "ccip" | "standard"

export type BridgeActivityStatus = "BRIDGED" | "PENDING" | "ERROR"

export interface BridgeActivity {
  amount: string
  status: BridgeActivityStatus
  activityKey: string
  bridgeRoute: BridgeRoute
  fromNetwork: string
  toNetwork: string
  txHash: string
  timestamp: number
  explorerUrl: string
}

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
  getBridgingTime(route: BridgeRoute): number {
    return this.context.getBridgingTime(route)
  }

  getContext(): NetworkContext {
    return this.context
  }

  /**
   * Fetches bridge activities for a given account
   * @param {string} account - Account address
   * @param {number | string} [fromBlock=-10000] - Starting block (default: last 10000 blocks)
   * @return {Promise<BridgeActivity[]>} Array of bridge activities
   */
  async fetchBridgeActivities(
    account: string,
    fromBlock: number | string = -30000
  ): Promise<BridgeActivity[]> {
    if (!this.context || !this.context.tokenPool) return []

    const provider = this.context.tokenPool.provider
    const currentBlock = await provider.getBlockNumber()
    const startBlock =
      typeof fromBlock === "number" && fromBlock < 0
        ? Math.max(0, currentBlock + fromBlock)
        : (fromBlock as number)

    const fetcher = new BridgeActivityFetcher({
      account,
      provider,
      chainId: this.context.chainId,
      networkType: this.context.networkType as "ethereum" | "bob",
      contracts: {
        tokenPool: this.context.tokenPool,
        ccipRouter: this.context.ccipRouter,
        standardBridge: this.context.standardBridge,
        token: this.context.token,
      },
      fromBlock: startBlock,
      toBlock: "latest",
    })

    return await fetcher.fetchAllActivities()
  }
}
