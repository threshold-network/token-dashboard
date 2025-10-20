import { BigNumber, Contract } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { JsonRpcProvider } from "@ethersproject/providers"
import { EthereumConfig } from "../types"
import { NetworkContext } from "./context/NetworkContext"
import { BridgeActivityFetcher } from "./bridgeActivityFetcher"
import { getArtifact } from "../utils/contract"
import { getCrossChainRpcUrl } from "../../networks/utils/getCrossChainRpcUrl"
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
} from "@gobob/viem"
import { mainnet, sepolia } from "@gobob/viem/chains"
import { getWithdrawals, buildProveWithdrawal } from "@gobob/viem/op-stack"
import {
  getL2Output as getL2OutputKailua,
  proveWithdrawal,
} from "@gobob/viem/op-stack-kailua"
import { SupportedChainIds } from "../../networks/enums/networks"
// Regular viem imports (different from @gobob/viem)
import {
  createPublicClient as createPublicClientViem,
  createWalletClient as createWalletClientViem,
  http as httpViem,
} from "viem"
import { mainnet as mainnetViem, sepolia as sepoliaViem } from "viem/chains"
import { getWithdrawals as getWithdrawalsViem } from "viem/op-stack"

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
  fetchClaimableWithdrawals(account: string): Promise<ClaimableWithdrawal[]>
  proveWithdrawal(l2TxHash: string): Promise<string>
  claimWithdrawal(l2TxHash: string): Promise<TransactionResponse>
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

export interface ClaimableWithdrawal {
  txHash: string
  network: string
  amount: string
  timestamp: number
  readyAt: number
  canClaim: boolean
  claimed: boolean
  proven: boolean
  outputPosted: boolean
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
   * Proves a withdrawal from L2 to L1 on the BOB bridge.
   * Requires being connected on L1 (Ethereum/Sepolia) with a signer.
   * @param {string} l2TxHash - The transaction hash of the withdrawal on L2
   * @return {Promise<string>} Prove transaction hash
   */
  async proveWithdrawal(l2TxHash: string): Promise<string> {
    if (this.context.networkType !== "ethereum") {
      throw new Error("Prove must be executed from L1 (Ethereum/Sepolia)")
    }

    const l1Signer =
      (this.context.token as any).signer ||
      (this.context.ccipRouter as any).signer
    if (!l1Signer) {
      throw new Error("No signer available. Please connect your wallet on L1.")
    }

    const l2ChainId =
      this.context.chainId === SupportedChainIds.Ethereum
        ? SupportedChainIds.Bob
        : SupportedChainIds.BobSepolia
    const isMainnet = this.context.chainId === SupportedChainIds.Ethereum

    const portal = (this.context as any).optimismPortal
    if (!portal) {
      throw new Error("OptimismPortal contract not initialized.")
    }

    try {
      // Set up viem clients
      const l1Chain = isMainnet ? mainnet : sepolia
      const l2RpcUrl = getCrossChainRpcUrl(l2ChainId)

      const publicL1 = createPublicClient({
        chain: l1Chain,
        transport: http(),
      })

      const publicL2 = createPublicClient({
        transport: http(l2RpcUrl),
      })

      const walletL1 = createWalletClient({
        chain: l1Chain,
        transport: custom(window.ethereum as any),
      })

      // Get L2 transaction receipt
      const receipt = await publicL2.getTransactionReceipt({
        hash: l2TxHash as `0x${string}`,
      })

      // Extract withdrawal using viem's getWithdrawals utility
      const [withdrawal] = getWithdrawals(receipt)
      if (!withdrawal) {
        throw new Error("No withdrawal found in transaction")
      }
      // Get L2 output for the withdrawal block
      const sourceId = this.context.chainId // L1 chain ID
      const bobChain = {
        id: l2ChainId,
        name: isMainnet ? "BOB" : "BOB Sepolia",
        sourceId: sourceId,
        contracts: {
          portal: {
            [sourceId]: {
              address: portal.address as `0x${string}`,
            },
          },
          l2OutputOracle: {
            [sourceId]: {
              address:
                sourceId === SupportedChainIds.Ethereum
                  ? "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1" // mainnet
                  : ("0xaE23861853F08Ceb27e2a944BE97D8CCa03e95bC" as `0x${string}`), // sepolia
            },
          },
          disputeGameFactory: {
            [sourceId]: {
              address:
                sourceId === SupportedChainIds.Ethereum
                  ? "0x96123dbFC3253185B594c6a7472EE5A21E9B1079"
                  : ("0x7a25d06Af869d0A94f6effAfFa0A830EEBF1EcfB" as `0x${string}`), // sepolia DisputeGameFactoryProxy - from BOB docs
            },
          },
        },
      }

      const output = await getL2OutputKailua(publicL1, {
        chain: l1Chain,
        l2BlockNumber: receipt.blockNumber,
        targetChain: bobChain as any,
      })

      // Build the proof
      const proveArgs = await buildProveWithdrawal(publicL2, {
        withdrawal,
        output,
        chain: null,
      })

      // Send the prove transaction
      const [account] = await walletL1.getAddresses()
      const proveHash = await proveWithdrawal(walletL1, {
        account: account as `0x${string}`,
        portalAddress: portal.address as `0x${string}`,
        l2OutputIndex: proveArgs.l2OutputIndex,
        outputRootProof: proveArgs.outputRootProof,
        withdrawalProof: proveArgs.withdrawalProof,
        withdrawal: proveArgs.withdrawal,
      })

      return proveHash
    } catch (err: any) {
      console.error("[proveWithdrawal] Error:", err)
      throw new Error(`Failed to prove withdrawal: ${err?.message || err}`)
    }
  }

  /**
   * Finalizes a withdrawal on L1 using the OP Stack CrossChainMessenger if available.
   * Requires being connected on L1 (Ethereum/Sepolia) with a signer.
   * @param {string} l2TxHash - The transaction hash of the withdrawal on L2
   * @return {Promise<TransactionResponse>} Transaction response
   */
  async claimWithdrawal(l2TxHash: string): Promise<TransactionResponse> {
    if (this.context.networkType !== "ethereum") {
      throw new Error("Claim must be executed from L1 (Ethereum/Sepolia)")
    }

    const l1Signer =
      (this.context.token as any).signer ||
      (this.context.ccipRouter as any).signer
    if (!l1Signer) {
      throw new Error("No signer available. Please connect your wallet on L1.")
    }

    const l2ChainId =
      this.context.chainId === SupportedChainIds.Ethereum
        ? SupportedChainIds.Bob
        : SupportedChainIds.BobSepolia
    const isMainnet = this.context.chainId === SupportedChainIds.Ethereum

    const portal = (this.context as any).optimismPortal
    if (!portal) {
      throw new Error("OptimismPortal contract not initialized.")
    }

    try {
      // getCrossChainRpcUrl already imported at top

      // Set up viem clients
      const l1Chain = isMainnet ? mainnet : sepolia
      const l2RpcUrl = getCrossChainRpcUrl(l2ChainId)

      const publicL1 = createPublicClient({
        chain: l1Chain,
        transport: http(),
      })

      const publicL2 = createPublicClient({
        transport: http(l2RpcUrl),
      })

      const walletL1 = createWalletClient({
        chain: l1Chain,
        transport: custom(window.ethereum as any),
      })

      // Get L2 transaction receipt
      const receipt = await publicL2.getTransactionReceipt({
        hash: l2TxHash as `0x${string}`,
      })

      // Extract withdrawal using viem's getWithdrawals utility
      const [withdrawal] = getWithdrawals(receipt)
      if (!withdrawal) {
        throw new Error("No withdrawal found in transaction")
      }
      // Check if we can finalize via callStatic first
      await portal.callStatic.finalizeWithdrawalTransaction(withdrawal)

      // If callStatic succeeds, send the actual transaction
      const tx = await portal.finalizeWithdrawalTransaction(withdrawal)
      console.log("[claimWithdrawal] Finalization transaction sent:", tx.hash)
      return tx
    } catch (err: any) {
      console.error("[claimWithdrawal] Error:", err)
      throw new Error(`Failed to claim withdrawal: ${err?.message || err}`)
    }
  }

  /**
   * Fetches bridge activities for a given account
   * @param {string} account - Account address
   * @param {number | string} [fromBlock=0] - Starting block (default: last 0 blocks)
   * @return {Promise<BridgeActivity[]>} Array of bridge activities
   */
  async fetchBridgeActivities(
    account: string,
    fromBlock: number | string = 0
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
        optimismPortal: (this.context as any).optimismPortal,
      },
      fromBlock: startBlock,
      toBlock: "latest",
    })

    const activities = await fetcher.fetchAllActivities()

    // On L1, also include claimable withdrawals (from L2 StandardBridge)
    if (this.context.networkType === "ethereum") {
      try {
        const claimables = await this.fetchClaimableWithdrawals(account)
        if (Array.isArray(claimables) && claimables.length > 0) {
          const isMainnet = this.context.chainId === SupportedChainIds.Ethereum
          const fromNetwork = isMainnet ? "BOB" : "BOB Sepolia"
          const toNetwork = isMainnet ? "Ethereum" : "Ethereum Sepolia"
          for (const claimable of claimables) {
            const explorerUrl = isMainnet
              ? `https://explorer.gobob.xyz/tx/${claimable.txHash}`
              : `https://bob-sepolia.explorer.gobob.xyz/tx/${claimable.txHash}`
            const activity: BridgeActivity = {
              amount: claimable.amount,
              status: claimable.claimed ? "BRIDGED" : "PENDING",
              activityKey: `standard-claimable-${claimable.txHash}`,
              bridgeRoute: "standard",
              fromNetwork,
              toNetwork,
              txHash: claimable.txHash,
              timestamp: claimable.timestamp,
              explorerUrl,
            }
            if (!activities.some((a) => a.txHash === activity.txHash)) {
              activities.push(activity)
            }
          }
        }
      } catch {}
    }

    activities.sort((a, b) => b.timestamp - a.timestamp)
    return activities
  }

  async fetchClaimableWithdrawals(
    account: string
  ): Promise<ClaimableWithdrawal[]> {
    if (!account) return []

    // This method should only be called on L1 (Ethereum/Sepolia)
    if (this.context.networkType !== "ethereum") {
      return []
    }

    // Reuse context-bound implementation: call through to L1 OptimismPortal plus L2 StandardBridge
    try {
      // Inlined lightweight implementation to keep API surface in one place
      const l2ChainId =
        this.context.chainId === SupportedChainIds.Ethereum
          ? SupportedChainIds.Bob
          : SupportedChainIds.BobSepolia

      // Using imports from top of file

      let l2RpcUrl: string
      try {
        l2RpcUrl = getCrossChainRpcUrl(l2ChainId)
      } catch (rpcError) {
        console.error(
          "[fetchClaimableWithdrawals] Error getting RPC URL:",
          rpcError
        )
        throw rpcError
      }
      const l2Provider = new JsonRpcProvider(l2RpcUrl)

      const standardBridgeArtifact = getArtifact(
        "StandardBridge" as any,
        l2ChainId
      )

      if (!standardBridgeArtifact) {
        return []
      }

      const standardBridgeL2 = new Contract(
        standardBridgeArtifact.address,
        standardBridgeArtifact.abi,
        l2Provider
      )

      let l2Current: number
      try {
        // Add timeout for the RPC call
        const blockNumberPromise = l2Provider.getBlockNumber()
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () => reject(new Error("Timeout getting L2 block number")),
            10000
          )
        )
        l2Current = await Promise.race([blockNumberPromise, timeoutPromise])
      } catch (blockError) {
        console.error(
          "[fetchClaimableWithdrawals] Error getting L2 block number:",
          blockError
        )
        // Cannot proceed without L2 block number
        return []
      }

      // Scan ~60 days back in chunks to capture older withdrawals
      const maxLookbackBlocks = 3000000
      const chunkSize = 250000
      const earliest = Math.max(0, l2Current - maxLookbackBlocks)
      // eslint-disable-next-line new-cap
      const filter = (standardBridgeL2.filters as any)["WithdrawalInitiated"](
        null,
        null,
        account
      )
      const events: any[] = []
      for (let to = l2Current; to > earliest; to -= chunkSize) {
        const from = Math.max(earliest, to - chunkSize + 1)
        try {
          const chunk = await standardBridgeL2.queryFilter(filter, from, to)
          if (chunk.length) {
            events.push(...chunk)
          }
        } catch (e) {
          console.warn(
            `[fetchClaimableWithdrawals] Failed to query chunk ${from}-${to}:`,
            e
          )
        }
      }

      // Get the actual delay from the OptimismPortal contract
      let totalDelay = 0
      const portal = (this.context as any).optimismPortal
      if (!portal) {
        console.error(
          "[fetchClaimableWithdrawals] OptimismPortal not available, cannot determine delays"
        )
        // Return empty if we can't determine delays
        return []
      }

      try {
        const proofDelay = Number(await portal.proofMaturityDelaySeconds())
        const finalityDelay = Number(
          await portal.disputeGameFinalityDelaySeconds()
        )
        if (Number.isFinite(proofDelay) && Number.isFinite(finalityDelay)) {
          totalDelay = proofDelay + finalityDelay
        } else {
          throw new Error("Invalid delay values from contract")
        }
      } catch (error) {
        console.error(
          "[fetchClaimableWithdrawals] Error fetching portal delays:",
          error
        )
        // Cannot proceed without knowing the delays
        return []
      }

      const results: ClaimableWithdrawal[] = []
      const nowSec = Math.floor(Date.now() / 1000)
      for (const ev of events) {
        try {
          const block = await l2Provider.getBlock(ev.blockNumber)
          const amount = ev.args?.amount ? ev.args.amount.toString() : "0"
          const withdrawalTimestamp = block?.timestamp || 0
          const claimed = false // Full withdrawalHash cross-check omitted in lean version

          // Check if the withdrawal is proven and get proof timestamp
          let proven = false
          let proofTimestamp = 0
          let readyAt = 0

          // Check if L2 output has been posted to L1
          let outputPosted = false
          if (portal && !claimed) {
            try {
              // Import viem utilities
              // Using viem imports from top of file
              const l1ChainKailua =
                this.context.chainId === SupportedChainIds.Ethereum
                  ? mainnet
                  : sepolia
              const publicL1 = createPublicClient({
                chain: l1ChainKailua,
                transport: http(),
              })

              // Get the withdrawal transaction receipt from L2
              const receipt = await l2Provider.getTransactionReceipt(
                ev.transactionHash
              )
              if (receipt) {
                // Extract withdrawal info from the receipt
                const withdrawals = getWithdrawalsViem(receipt as any)

                if (withdrawals && withdrawals.length > 0) {
                  const withdrawalInfo = withdrawals[0]
                  // Check if withdrawal is proven using provenWithdrawals mapping
                  const withdrawalHash = withdrawalInfo.withdrawalHash

                  try {
                    // The provenWithdrawals mapping is double-mapped: withdrawalHash => prover => ProvenWithdrawal
                    // We need to check if the current account or the withdrawal sender has proven it

                    // First check if the current account proved it
                    let provenData = await portal.provenWithdrawals(
                      withdrawalHash,
                      account
                    )

                    // Check if proven by current account
                    if (
                      provenData &&
                      provenData.timestamp &&
                      provenData.timestamp.gt(0)
                    ) {
                      proven = true
                      proofTimestamp = Number(provenData.timestamp.toString())
                    } else {
                      // If not proven by current account, check if proven by the withdrawal sender
                      // The sender is the 'from' field in the withdrawal
                      const withdrawalSender = withdrawalInfo.sender
                      if (
                        withdrawalSender &&
                        withdrawalSender.toLowerCase() !== account.toLowerCase()
                      ) {
                        provenData = await portal.provenWithdrawals(
                          withdrawalHash,
                          withdrawalSender
                        )

                        if (
                          provenData &&
                          provenData.timestamp &&
                          provenData.timestamp.gt(0)
                        ) {
                          proven = true
                          proofTimestamp = Number(
                            provenData.timestamp.toString()
                          )
                        }
                      }
                    }

                    // Check if L2 output has been posted to L1
                    if (!proven) {
                      // For withdrawals older than 4 hours, assume output has been posted
                      // This is a temporary workaround for BOB network where output checking might fail
                      const withdrawalAge = nowSec - withdrawalTimestamp
                      if (withdrawalAge > 4 * 60 * 60) {
                        // 4 hours
                        outputPosted = true
                      } else {
                        try {
                          // Try to get the L2 output for this withdrawal's block
                          // Using getL2Output from viem imports at top
                          const sourceId = this.context.chainId // L1 chain ID
                          const isMainnet =
                            this.context.chainId === SupportedChainIds.Ethereum
                          const bobChain = {
                            id: l2ChainId,
                            name: isMainnet ? "BOB" : "BOB Sepolia",
                            sourceId: sourceId,
                            contracts: {
                              portal: {
                                [sourceId]: {
                                  address: portal.address as `0x${string}`,
                                },
                              },
                              l2OutputOracle: {
                                [sourceId]: {
                                  address:
                                    sourceId === SupportedChainIds.Ethereum
                                      ? "0xdDa53E23f8a32640b04D7256e651C1db98dB11C1" // mainnet
                                      : ("0xaE23861853F08Ceb27e2a944BE97D8CCa03e95bC" as `0x${string}`), // sepolia
                                },
                              },
                              disputeGameFactory: {
                                [sourceId]: {
                                  address:
                                    sourceId === SupportedChainIds.Ethereum
                                      ? "0x96123dbFC3253185B594c6a7472EE5A21E9B1079"
                                      : ("0x7a25d06Af869d0A94f6effAfFa0A830EEBF1EcfB" as `0x${string}`), // sepolia DisputeGameFactoryProxy - from BOB docs
                                },
                              },
                            },
                          }
                          const l1ChainKailua =
                            this.context.chainId === SupportedChainIds.Ethereum
                              ? mainnet
                              : sepolia
                          const output = await getL2OutputKailua(publicL1, {
                            chain: l1ChainKailua,
                            l2BlockNumber: BigInt(receipt.blockNumber),
                            targetChain: bobChain as any,
                          })

                          if (output) {
                            outputPosted = true
                          }
                        } catch (outputError: any) {
                          // For BOB network, if we get an error checking output,
                          // assume it's posted if withdrawal is old enough
                          if (withdrawalAge > 2 * 60 * 60) {
                            // 2 hours
                            outputPosted = true
                          } else {
                            outputPosted = false
                          }
                        }
                      }
                    } else {
                      // If proven, output must have been posted
                      outputPosted = true
                    }
                  } catch (provenCheckError) {
                    console.error(
                      "[fetchClaimableWithdrawals] Error calling provenWithdrawals:",
                      provenCheckError
                    )
                  }
                }
              }
            } catch (provenCheckError) {
              console.error(
                "[fetchClaimableWithdrawals] Error checking withdrawal proven status:",
                provenCheckError
              )
              // Default to false if we can't check
            }
          }

          // Calculate readyAt based on proof status
          if (proven && proofTimestamp > 0) {
            // If proven, ready 7 days after proof submission
            readyAt = proofTimestamp + totalDelay
          } else {
            // If not proven, we can't determine when it will be ready
            // Set to 0 to indicate it's not applicable yet
            readyAt = 0
          }

          const withdrawal = {
            txHash: ev.transactionHash,
            network:
              this.context.chainId === SupportedChainIds.Ethereum
                ? "BOB"
                : "BOB Sepolia",
            amount,
            timestamp: withdrawalTimestamp,
            readyAt,
            canClaim: proven && nowSec >= readyAt && !claimed,
            claimed,
            proven,
            outputPosted,
          }
          results.push(withdrawal)
        } catch {}
      }

      results.sort((a, b) => b.timestamp - a.timestamp)
      return results
    } catch (error) {
      console.error("[fetchClaimableWithdrawals] Error:", error)
      return []
    }
  }
}
