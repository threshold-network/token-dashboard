import { BigNumber, Contract, Event, providers } from "ethers"
import { BridgeActivity, BridgeActivityStatus, BridgeRoute } from "./index"

interface FetchOptions {
  account: string
  provider: providers.Provider
  chainId: number
  networkType: "ethereum" | "bob"
  contracts: {
    tokenPool?: Contract
    ccipRouter?: Contract
    standardBridge?: Contract
    token?: Contract
  }
  fromBlock: number
  toBlock: number | "latest"
}

export class BridgeActivityFetcher {
  private processedTxHashes = new Set<string>()
  private activities: BridgeActivity[] = []

  constructor(private options: FetchOptions) {}

  async fetchAllActivities(): Promise<BridgeActivity[]> {
    // Run all fetchers in parallel
    await Promise.all([
      this.fetchTokenPoolEvents(),
      this.fetchCCIPTransactions(),
      this.fetchStandardBridgeEvents(),
    ])

    // Sort by timestamp descending
    this.activities.sort((a, b) => b.timestamp - a.timestamp)
    return this.activities
  }

  private async fetchTokenPoolEvents() {
    if (!this.options.contracts.tokenPool) return

    try {
      const tokenPool = this.options.contracts.tokenPool
      const isL1 =
        this.options.chainId === 1 || this.options.chainId === 11155111

      if (isL1) {
        // Fetch Locked events (deposits to L2)
        await this.fetchEvents(tokenPool, "Locked", async (event) => {
          const activity = await this.parseTokenPoolEvent(
            event,
            "PENDING",
            "deposit"
          )
          if (activity) this.addActivity(activity)
        })

        // Fetch Released events (received from L2)
        await this.fetchEvents(tokenPool, "Released", async (event) => {
          const activity = await this.parseTokenPoolEvent(
            event,
            "BRIDGED",
            "withdrawal"
          )
          if (activity) this.addActivity(activity)
        })
      } else {
        // Fetch Burned events (withdrawals to L1)
        await this.fetchEvents(tokenPool, "Burned", async (event) => {
          const activity = await this.parseTokenPoolEvent(
            event,
            "PENDING",
            "withdrawal"
          )
          if (activity) this.addActivity(activity)
        })

        // Fetch Minted events (received from L1)
        await this.fetchEvents(tokenPool, "Minted", async (event) => {
          const activity = await this.parseTokenPoolEvent(
            event,
            "BRIDGED",
            "deposit"
          )
          if (activity) this.addActivity(activity)
        })
      }
    } catch (error) {
      console.error("[ActivityFetcher] Error fetching TokenPool events:", error)
    }
  }

  private async fetchCCIPTransactions() {
    if (!this.options.contracts.ccipRouter || !this.options.contracts.token)
      return

    try {
      const routerAddress =
        this.options.contracts.ccipRouter.address.toLowerCase()
      const accountLower = this.options.account.toLowerCase()

      // Query TBTC Transfer logs where 'from' is the user's account
      const transferTopic =
        this.options.contracts.token.interface.getEventTopic("Transfer")
      const paddedFrom = `0x${accountLower.slice(2).padStart(64, "0")}`

      const logs = await this.options.provider.getLogs({
        fromBlock: this.options.fromBlock,
        toBlock: this.options.toBlock,
        address: this.options.contracts.token.address,
        topics: [transferTopic, paddedFrom],
      })

      for (const log of logs) {
        if (this.processedTxHashes.has(log.transactionHash)) continue

        try {
          const tx = await this.options.provider.getTransaction(
            log.transactionHash
          )
          if (!tx) continue

          // Only consider transfers that occurred in a transaction sent to the CCIP Router
          if ((tx.to || "").toLowerCase() !== routerAddress) continue

          const parsed = this.options.contracts.token.interface.parseLog(log)
          const amount = parsed.args?.value?.toString() || "0"

          // Build activity from this transaction
          const block = await this.options.provider.getBlock(tx.blockNumber!)
          const { fromNetwork, toNetwork } = this.getNetworks()

          this.addActivity({
            amount,
            status: "PENDING",
            activityKey: `ccip-${tx.hash}`,
            bridgeRoute: "ccip",
            fromNetwork,
            toNetwork,
            txHash: tx.hash,
            timestamp: block.timestamp,
            explorerUrl: `https://ccip.chain.link/tx/${tx.hash}`,
          })

          this.processedTxHashes.add(tx.hash)
        } catch {}
      }
    } catch {}
  }

  private async fetchStandardBridgeEvents() {
    if (
      !this.options.contracts.standardBridge ||
      this.options.networkType !== "bob"
    )
      return

    try {
      await this.fetchEvents(
        this.options.contracts.standardBridge,
        "WithdrawalInitiated",
        async (event) => {
          const activity = await this.parseStandardBridgeEvent(event)
          if (activity) this.addActivity(activity)
        }
      )
    } catch {}
  }

  private async fetchEvents(
    contract: Contract,
    eventName: string,
    handler: (event: Event) => Promise<void>
  ) {
    const chunkSize = 5000
    let currentBlock = this.options.fromBlock

    while (
      currentBlock <=
      (this.options.toBlock === "latest"
        ? await this.options.provider.getBlockNumber()
        : this.options.toBlock)
    ) {
      const toBlock = Math.min(
        currentBlock + chunkSize - 1,
        this.options.toBlock === "latest"
          ? await this.options.provider.getBlockNumber()
          : this.options.toBlock
      )

      try {
        // Get all events first
        const filter = contract.filters[eventName]()
        const events = await contract.queryFilter(filter, currentBlock, toBlock)

        // Filter and process events
        for (const event of events) {
          if (this.processedTxHashes.has(event.transactionHash)) continue

          // Check if event is related to our account
          const isRelevant = await this.isEventRelevantToAccount(
            event,
            eventName
          )
          if (isRelevant) {
            this.processedTxHashes.add(event.transactionHash)
            await handler(event)
          }
        }
      } catch {}

      currentBlock = toBlock + 1
    }
  }

  private async isEventRelevantToAccount(
    event: Event,
    eventName: string
  ): Promise<boolean> {
    const accountLower = this.options.account.toLowerCase()

    // Check event args first
    if (eventName === "Locked" || eventName === "Burned") {
      if (event.args?.sender?.toLowerCase() === accountLower) return true
    } else if (eventName === "Released" || eventName === "Minted") {
      if (event.args?.recipient?.toLowerCase() === accountLower) return true
    } else if (eventName === "WithdrawalInitiated") {
      if (event.args?.from?.toLowerCase() === accountLower) return true
    }

    // Check transaction sender as fallback
    try {
      const tx = await event.getTransaction()
      return tx.from.toLowerCase() === accountLower
    } catch {
      return false
    }
  }

  private async parseCCIPTransaction(
    tx: providers.TransactionResponse
  ): Promise<BridgeActivity | null> {
    try {
      const receipt = await this.options.provider.getTransactionReceipt(tx.hash)
      if (!receipt) return null

      // Extract amount
      let amount = "0"

      // Try to find TokenPool events
      if (this.options.contracts.tokenPool) {
        const tokenPoolAddress =
          this.options.contracts.tokenPool.address.toLowerCase()
        const lockedTopic =
          this.options.contracts.tokenPool.interface.getEventTopic("Locked")
        const burnedTopic =
          this.options.contracts.tokenPool.interface.getEventTopic("Burned")

        for (const log of receipt.logs) {
          if (log.address.toLowerCase() === tokenPoolAddress) {
            if (
              log.topics[0] === lockedTopic ||
              log.topics[0] === burnedTopic
            ) {
              try {
                const parsed =
                  this.options.contracts.tokenPool.interface.parseLog(log)
                amount = parsed.args?.amount?.toString() || "0"
                break
              } catch {}
            }
          }
        }
      }

      // Fallback to Transfer events
      if (amount === "0" && this.options.contracts.token) {
        const transferTopic =
          this.options.contracts.token.interface.getEventTopic("Transfer")
        const paddedFrom = `0x${this.options.account
          .slice(2)
          .toLowerCase()
          .padStart(64, "0")}`

        for (const log of receipt.logs) {
          if (
            log.address.toLowerCase() ===
              this.options.contracts.token.address.toLowerCase() &&
            log.topics[0] === transferTopic &&
            log.topics[1]?.toLowerCase() === paddedFrom
          ) {
            try {
              const parsed =
                this.options.contracts.token.interface.parseLog(log)
              amount = parsed.args?.value?.toString() || "0"
              break
            } catch {}
          }
        }
      }

      const block = await this.options.provider.getBlock(tx.blockNumber!)
      const { fromNetwork, toNetwork } = this.getNetworks()

      return {
        amount,
        status: "PENDING",
        activityKey: `ccip-${tx.hash}`,
        bridgeRoute: "ccip",
        fromNetwork,
        toNetwork,
        txHash: tx.hash,
        timestamp: block.timestamp,
        explorerUrl: `https://ccip.chain.link/tx/${tx.hash}`,
      }
    } catch {
      return null
    }
  }

  private async parseTokenPoolEvent(
    event: Event,
    status: BridgeActivityStatus,
    direction: "deposit" | "withdrawal"
  ): Promise<BridgeActivity | null> {
    try {
      const block = await event.getBlock()
      const amount = event.args?.amount?.toString() || "0"

      let fromNetwork: string
      let toNetwork: string

      if (this.options.networkType === "ethereum") {
        if (direction === "deposit") {
          fromNetwork = this.getNetworkName(this.options.chainId)
          toNetwork = this.options.chainId === 1 ? "BOB" : "BOB Sepolia"
        } else {
          fromNetwork = this.options.chainId === 1 ? "BOB" : "BOB Sepolia"
          toNetwork = this.getNetworkName(this.options.chainId)
        }
      } else {
        if (direction === "withdrawal") {
          fromNetwork = this.getNetworkName(this.options.chainId)
          toNetwork =
            this.options.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"
        } else {
          fromNetwork =
            this.options.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"
          toNetwork = this.getNetworkName(this.options.chainId)
        }
      }

      return {
        amount,
        status,
        activityKey: `${event.event}-${event.transactionHash}-${event.logIndex}`,
        bridgeRoute: "ccip",
        fromNetwork,
        toNetwork,
        txHash: event.transactionHash,
        timestamp: block.timestamp,
        explorerUrl: `https://ccip.chain.link/tx/${event.transactionHash}`,
      }
    } catch {
      return null
    }
  }

  private async parseStandardBridgeEvent(
    event: Event
  ): Promise<BridgeActivity | null> {
    try {
      const block = await event.getBlock()
      const amount = event.args?.amount?.toString() || "0"
      const fromNetwork = this.getNetworkName(this.options.chainId)
      const toNetwork =
        this.options.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia"

      return {
        amount,
        status: "PENDING",
        activityKey: `standard-${event.transactionHash}-${event.logIndex}`,
        bridgeRoute: "standard",
        fromNetwork,
        toNetwork,
        txHash: event.transactionHash,
        timestamp: block.timestamp,
        explorerUrl:
          this.options.chainId === 60808
            ? `https://explorer.gobob.xyz/tx/${event.transactionHash}`
            : `https://bob-sepolia.explorer.gobob.xyz/tx/${event.transactionHash}`,
      }
    } catch {
      return null
    }
  }

  private getNetworks(): { fromNetwork: string; toNetwork: string } {
    if (this.options.networkType === "ethereum") {
      return {
        fromNetwork: this.getNetworkName(this.options.chainId),
        toNetwork: this.options.chainId === 1 ? "BOB" : "BOB Sepolia",
      }
    } else {
      return {
        fromNetwork: this.getNetworkName(this.options.chainId),
        toNetwork:
          this.options.chainId === 60808 ? "Ethereum" : "Ethereum Sepolia",
      }
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

  private addActivity(activity: BridgeActivity) {
    // Avoid duplicates
    if (!this.activities.some((a) => a.txHash === activity.txHash)) {
      this.activities.push(activity)
    }
  }
}
