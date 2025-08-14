import { BigNumber, Event } from "ethers"
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
    fromBlock: number | string = -50000
  ): Promise<BridgeActivity[]> {
    const activities: BridgeActivity[] = []

    if (!this.context || !this.context.tokenPool) {
      console.log("Bridge contracts not initialized")
      return activities
    }

    // Import getContractPastEvents utility
    const { getContractPastEvents } = await import("../utils")

    // Get the block number to start from
    const currentBlock = await this.context.tokenPool.provider.getBlockNumber()
    const startBlock =
      typeof fromBlock === "number" && fromBlock < 0
        ? Math.max(0, currentBlock + fromBlock)
        : fromBlock

    // fetching window computed using fromBlock

    // Check if contract has the expected events
    // token pool filters check

    // Also log router filters if available
    if (this.context.ccipRouter) {
      // router available
    }
    try {
      if (this.context.chainId === 1 || this.context.chainId === 11155111) {
        // L1 (Ethereum/Sepolia)
        // L1 events (Locked/Released)
        // Locked events: user deposits (sends to L2)
        // First try without filter to see if there are any events
        const allLockedEvents = await getContractPastEvents(
          this.context.tokenPool,
          {
            eventName: "Locked",
            filterParams: [], // no filter first
            fromBlock: startBlock,
            toBlock: "latest",
          }
        )
        // total Locked events

        // Now filter by sender
        // eslint-disable-next-line prefer-const
        let lockedEvents = allLockedEvents.filter((event) => {
          const matches =
            event.args?.sender?.toLowerCase() === account.toLowerCase()
          if (!matches && allLockedEvents.length < 10) {
            // skip
          }
          return matches
        })
        // matched Locked events for account

        // If no events found by indexed param, filter by transaction sender
        if (lockedEvents.length === 0 && allLockedEvents.length > 0) {
          // fallback: filter by transaction sender
          for (const event of allLockedEvents) {
            try {
              const tx = await event.getTransaction()
              if (tx.from.toLowerCase() === account.toLowerCase()) {
                // found tx initiated by user
                lockedEvents.push(event)
              }
            } catch (err) {
              console.error("Error getting transaction:", err)
            }
          }
          // matched by tx sender
        }
        // process Locked events
        for (const event of lockedEvents) {
          const activity = await this.parseTokenPoolEvent(
            event,
            "PENDING",
            "deposit"
          )
          if (activity) {
            activities.push(activity)
          }
        }

        // Released events: user receives from L2
        const allReleasedEvents = await getContractPastEvents(
          this.context.tokenPool,
          {
            eventName: "Released",
            filterParams: [], // no filter first
            fromBlock: startBlock,
            toBlock: "latest",
          }
        )
        // total Released events

        // Filter by recipient
        // eslint-disable-next-line prefer-const
        let releasedEvents = allReleasedEvents.filter(
          (event) =>
            event.args?.recipient?.toLowerCase() === account.toLowerCase()
        )
        // matched Released events for account

        // If no events by recipient, check by transaction sender
        if (releasedEvents.length === 0 && allReleasedEvents.length > 0) {
          // fallback: filter Released by tx sender
          for (const event of allReleasedEvents) {
            try {
              const tx = await event.getTransaction()
              if (tx.from.toLowerCase() === account.toLowerCase()) {
                // found user-initiated Released tx
                releasedEvents.push(event)
              }
            } catch (err) {
              console.error("Error getting transaction:", err)
            }
          }
          // matched Released by tx sender
        }
        for (const event of releasedEvents) {
          const activity = await this.parseTokenPoolEvent(
            event,
            "BRIDGED",
            "withdrawal"
          )
          if (activity) activities.push(activity)
        }
      } else {
        // L2 (BOB/BOB Sepolia)
        // L2 events (Burned/Minted)
        // Burned events: user withdraws (sends to L1)
        const allBurnedEvents = await getContractPastEvents(
          this.context.tokenPool,
          {
            eventName: "Burned",
            filterParams: [], // no filter first
            fromBlock: startBlock,
            toBlock: "latest",
          }
        )
        // total Burned events

        // Filter by sender
        // eslint-disable-next-line prefer-const
        let burnedEvents = allBurnedEvents.filter(
          (event) => event.args?.sender?.toLowerCase() === account.toLowerCase()
        )
        // matched Burned events for account

        // If no events by sender, check by transaction sender
        if (burnedEvents.length === 0 && allBurnedEvents.length > 0) {
          // fallback: filter Burned by tx sender
          for (const event of allBurnedEvents) {
            try {
              const tx = await event.getTransaction()
              if (tx.from.toLowerCase() === account.toLowerCase()) {
                // found user-initiated Burned tx
                burnedEvents.push(event)
              }
            } catch (err) {
              console.error("Error getting transaction:", err)
            }
          }
          // matched Burned by tx sender
        }
        for (const event of burnedEvents) {
          const activity = await this.parseTokenPoolEvent(
            event,
            "PENDING",
            "withdrawal"
          )
          if (activity) activities.push(activity)
        }

        // Minted events: user receives from L1
        const allMintedEvents = await getContractPastEvents(
          this.context.tokenPool,
          {
            eventName: "Minted",
            filterParams: [], // no filter first
            fromBlock: startBlock,
            toBlock: "latest",
          }
        )
        // total Minted events

        // Filter by recipient
        // eslint-disable-next-line prefer-const
        let mintedEvents = allMintedEvents.filter(
          (event) =>
            event.args?.recipient?.toLowerCase() === account.toLowerCase()
        )
        // matched Minted events for account

        // If no events by recipient, check by transaction sender
        if (mintedEvents.length === 0 && allMintedEvents.length > 0) {
          // fallback: filter Minted by tx sender
          for (const event of allMintedEvents) {
            try {
              const tx = await event.getTransaction()
              if (tx.from.toLowerCase() === account.toLowerCase()) {
                // found user-initiated Minted tx
                mintedEvents.push(event)
              }
            } catch (err) {
              console.error("Error getting transaction:", err)
            }
          }
          // matched Minted by tx sender
        }
        for (const event of mintedEvents) {
          const activity = await this.parseTokenPoolEvent(
            event,
            "BRIDGED",
            "deposit"
          )
          if (activity) activities.push(activity)
        }
      }
    } catch (error) {
      // ignore token pool errors
    }

    // Standard bridge (WithdrawalInitiated) on L2 when used
    if (this.context.networkType === "bob" && this.context.standardBridge) {
      try {
        const getWithdrawalInitiated: any = (
          this.context.standardBridge.filters as any
        ).WithdrawalInitiated
        const withdrawFilter = getWithdrawalInitiated()
        const withdrawEvents = await this.context.standardBridge.queryFilter(
          withdrawFilter,
          fromBlock,
          "latest"
        )

        // Filter by indexed 'from' parameter
        const matchedEvents = withdrawEvents.filter((event) => {
          const fromParam = (event.args as any)?.from
          return fromParam && fromParam.toLowerCase() === account.toLowerCase()
        })

        // If no matches by event param, try by transaction sender as fallback
        if (matchedEvents.length === 0 && withdrawEvents.length > 0) {
          for (const event of withdrawEvents) {
            try {
              const tx = await event.getTransaction()
              if (tx.from.toLowerCase() === account.toLowerCase()) {
                matchedEvents.push(event)
              }
            } catch {
              // ignore tx fetch errors
            }
          }
        }

        for (const event of matchedEvents) {
          const activity = await this.parseStandardBridgeEvent(event)
          if (activity) {
            activities.push(activity)
          }
        }
      } catch (error) {
        // ignore standard bridge errors
      }
    }

    // Try to get CCIP messages from router if available
    if (this.context.ccipRouter) {
      try {
        const messageEvents = await getContractPastEvents(
          this.context.ccipRouter,
          {
            eventName: "MessageExecuted",
            filterParams: [],
            fromBlock: startBlock,
            toBlock: "latest",
          }
        )
        // optionally correlate with user
      } catch (error) {
        // ignore router errors
      }
    }

    // Sort by timestamp descending
    activities.sort((a, b) => b.timestamp - a.timestamp)

    // Return all activities - the hook will filter based on the current network
    // This avoids issues with stale context when the bridge instance is recreated
    return activities
  }

  private async parseCCIPEvent(event: Event): Promise<BridgeActivity | null> {
    try {
      const block = await event.getBlock()
      const fromNetwork = this.getNetworkName(this.context.chainId)
      const toNetwork =
        this.context.networkType === "ethereum" ? "Bob" : "Ethereum"

      return {
        amount: event.args?.tokenAmounts?.[0]?.amount?.toString() || "0",
        status: "BRIDGED",
        activityKey: `ccip-${event.transactionHash}-${event.logIndex}`,
        bridgeRoute: "ccip",
        fromNetwork,
        toNetwork,
        txHash: event.transactionHash,
        timestamp: block.timestamp,
        explorerUrl: `https://ccip.chain.link/tx/${event.transactionHash}`,
      }
    } catch (error) {
      // ignore parse error
      return null
    }
  }

  private async parseStandardBridgeEvent(
    event: Event
  ): Promise<BridgeActivity | null> {
    try {
      const block = await event.getBlock()
      const fromNetwork = this.getNetworkName(this.context.chainId)
      const toNetwork =
        this.context.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"

      // WithdrawalInitiated event args
      const eventArgs = event.args as any
      const amount = eventArgs?.amount || "0"

      return {
        amount: amount.toString(),
        status: "PENDING", // Standard bridge takes 7 days
        activityKey: `standard-${event.transactionHash}-${event.logIndex}`,
        bridgeRoute: "standard",
        fromNetwork,
        toNetwork,
        txHash: event.transactionHash,
        timestamp: block.timestamp,
        explorerUrl:
          this.context.chainId === 60808
            ? `https://explorer.gobob.xyz/tx/${event.transactionHash}`
            : `https://bob-sepolia.explorer.gobob.xyz/tx/${event.transactionHash}`,
      }
    } catch (error) {
      // ignore parse error
      return null
    }
  }

  private async parseTokenPoolEvent(
    event: Event,
    status: BridgeActivityStatus,
    direction: "deposit" | "withdrawal"
  ): Promise<BridgeActivity | null> {
    try {
      // parse token pool event
      const block = await event.getBlock()

      // Determine from/to networks based on current chain and direction
      let fromNetwork: string
      let toNetwork: string

      if (this.context.chainId === 1 || this.context.chainId === 11155111) {
        // On L1
        if (direction === "deposit") {
          // Locked event: sending from L1 to L2
          fromNetwork = this.getNetworkName(this.context.chainId)
          toNetwork = this.context.chainId === 1 ? "BOB" : "BOB Sepolia"
        } else {
          // Released event: received on L1 from L2
          fromNetwork = this.context.chainId === 1 ? "BOB" : "BOB Sepolia"
          toNetwork = this.getNetworkName(this.context.chainId)
        }
      } else {
        // On L2
        if (direction === "withdrawal") {
          // Burned event: sending from L2 to L1
          fromNetwork = this.getNetworkName(this.context.chainId)
          toNetwork =
            this.context.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"
        } else {
          // Minted event: received on L2 from L1
          fromNetwork =
            this.context.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"
          toNetwork = this.getNetworkName(this.context.chainId)
        }
      }

      // Extract amount from event args
      const amount = event.args?.amount || "0"

      const txHash = event.transactionHash
      const logIndex = event.logIndex

      return {
        amount: amount.toString(),
        status,
        activityKey: `${event.event}-${txHash}-${logIndex}`,
        bridgeRoute: "ccip",
        fromNetwork,
        toNetwork,
        txHash,
        timestamp: block.timestamp,
        explorerUrl: `https://ccip.chain.link/tx/${txHash}`,
      }
    } catch (error) {
      console.error("Failed to parse token pool event:", error)
      return null
    }
  }

  private getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1:
        return "Ethereum"
      case 11155111:
        return "Ethereum Sepolia"
      case 60808:
        return "BOB"
      case 808813:
        return "BOB Sepolia"
      default:
        return "Unknown"
    }
  }

  private getExplorerBaseUrl(chainId: number): string {
    switch (chainId) {
      case 1:
        return "https://etherscan.io/tx/"
      case 11155111:
        return "https://sepolia.etherscan.io/tx/"
      case 60808:
      case 808813:
        return "https://explorer.gobob.xyz/tx/"
      default:
        return ""
    }
  }
}

// Types are exported at the top of the file
