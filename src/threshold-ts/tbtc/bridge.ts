import { BigNumber, Contract, providers, Signer } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { MaxUint256 } from "@ethersproject/constants"
import { EthereumConfig, CrossChainConfig } from "../types"
import { IMulticall } from "../multicall"
import { getContract, getArtifact } from "../utils"

export interface IBridge {
  // Core bridge methods
  withdraw(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>
  withdrawLegacy(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>
  depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>
  withdrawToL1(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>

  // Approval helpers
  approveForCcip(amount: BigNumber): Promise<TransactionResponse | null>
  approveForStandardBridge(
    amount: BigNumber
  ): Promise<TransactionResponse | null>

  // Routing and quotes
  pickPath(amount: BigNumber): Promise<BridgeRoute>
  quoteFees(amount: BigNumber, route?: BridgeRoute): Promise<BridgeQuote>

  // Utilities
  getLegacyCapRemaining(): Promise<BigNumber>
  canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }>
  getCcipAllowance(): Promise<BigNumber>
  getAllowances(): Promise<{
    ccip: BigNumber
    standardBridge: BigNumber
  }>
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
  private _ethereumConfig: EthereumConfig
  private _crossChainConfig: CrossChainConfig
  private _multicall: IMulticall
  private _ccipContract: Contract | null = null
  private _standardBridgeContract: Contract | null = null
  private _tokenContract: Contract | null = null
  private _legacyCapCache: { value: BigNumber; timestamp: number } | null = null
  private readonly _cacheExpiry = 60000 // 1 minute in milliseconds

  constructor(
    ethereumConfig: EthereumConfig,
    crossChainConfig: CrossChainConfig,
    multicall: IMulticall
  ) {
    this._ethereumConfig = ethereumConfig
    this._crossChainConfig = crossChainConfig
    this._multicall = multicall

    // Initialize contracts
    this._initializeContracts()
  }

  private _initializeContracts(): void {
    const {
      chainId,
      shouldUseTestnetDevelopmentContracts,
      ethereumProviderOrSigner,
      account,
    } = this._ethereumConfig

    // Map BOB chain ID to mainnet/testnet for artifact loading
    const isBOBMainnet = chainId === 60808
    const isBOBTestnet = chainId === 808813

    if (!isBOBMainnet && !isBOBTestnet) {
      console.warn("Bridge: Not on BOB network, contracts will be null")
      return
    }

    // Use BOB chain ID directly for artifact loading
    const bobChainId = Number(chainId)

    // Get provider
    const provider = ethereumProviderOrSigner

    // Load CCIP Router
    const ccipArtifact = getArtifact(
      "CCIPRouter",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    this._ccipContract = ccipArtifact
      ? getContract(ccipArtifact.address, ccipArtifact.abi, provider, account)
      : null

    // Load Standard Bridge
    const standardBridgeArtifact = getArtifact(
      "StandardBridge",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    this._standardBridgeContract = standardBridgeArtifact
      ? getContract(
          standardBridgeArtifact.address,
          standardBridgeArtifact.abi,
          provider,
          account
        )
      : null

    // Load BOB tBTC Token (OptimismMintableUpgradableTBTC)
    const tokenArtifact = getArtifact(
      "OptimismMintableUpgradableTBTC",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    this._tokenContract = tokenArtifact
      ? getContract(tokenArtifact.address, tokenArtifact.abi, provider, account)
      : null

    // Log initialization status
    console.log("Bridge contracts initialized:", {
      ccip: !!this._ccipContract,
      standardBridge: !!this._standardBridgeContract,
      token: !!this._tokenContract,
    })
  }

  // Helper method to check if contracts are initialized
  private _ensureContractsInitialized(): void {
    if (
      !this._ccipContract ||
      !this._standardBridgeContract ||
      !this._tokenContract
    ) {
      throw new Error(
        "Bridge contracts not initialized. Ensure you're on BOB network."
      )
    }
  }

  async withdraw(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    // Ensure contracts are initialized
    this._ensureContractsInitialized()

    // Validate amount
    if (amount.lte(0)) {
      throw new Error("Withdrawal amount must be greater than zero")
    }

    // Check if CCIP path is appropriate
    const route = await this.pickPath(amount)
    if (route === "standard") {
      throw new Error(
        "Amount fits within legacy cap. Use withdrawLegacy() instead."
      )
    }
    // Note: Route validation already done in pickPath

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    // Use recipient from options or default to connected account
    const recipient = opts?.recipient || account

    try {
      // Check and handle approval
      const approvalTx = await this.approveForCcip(amount)
      if (approvalTx) {
        console.log(`Waiting for CCIP approval tx: ${approvalTx.hash}`)
        await approvalTx.wait()
      }

      // Build transaction parameters
      const txParams: any = {
        // Add gas parameters if provided
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      // Call CCIP withdraw function
      // Note: Actual method name and parameters depend on CCIP contract ABI
      const tx = await this._ccipContract!.withdraw(recipient, amount, txParams)

      console.log(`CCIP withdrawal initiated. Tx hash: ${tx.hash}`)

      return tx
    } catch (error: any) {
      console.error("CCIP withdrawal failed:", error)
      throw new Error(`CCIP withdrawal failed: ${error.message}`)
    }
  }

  async withdrawLegacy(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    // Ensure contracts are initialized
    this._ensureContractsInitialized()

    // Validate amount
    if (amount.lte(0)) {
      throw new Error("Withdrawal amount must be greater than zero")
    }

    // Check legacy cap remaining
    const legacyCapRemaining = await this.getLegacyCapRemaining()
    if (amount.gt(legacyCapRemaining)) {
      throw new Error(
        `Amount ${amount.toString()} exceeds legacy cap remaining ${legacyCapRemaining.toString()}. ` +
          `Use withdraw() for CCIP or wait for legacy cap to deplete.`
      )
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    // Use recipient from options or default to connected account
    const recipient = opts?.recipient || account

    try {
      // Check and handle approval
      const approvalTx = await this.approveForStandardBridge(amount)
      if (approvalTx) {
        console.log(
          `Waiting for Standard Bridge approval tx: ${approvalTx.hash}`
        )
        await approvalTx.wait()
      }

      // Build transaction parameters
      const txParams: any = {
        // Add gas parameters if provided
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      // Call Standard Bridge withdraw function
      // Note: Actual method name depends on Standard Bridge ABI
      // Optimism bridge typically uses withdrawTo or similar
      const tx = await this._standardBridgeContract!.withdrawTo(
        this._tokenContract!.address, // L2 token address
        recipient,
        amount,
        opts?.deadline || 0, // Optional deadline parameter
        "0x", // Extra data (typically empty)
        txParams
      )

      console.log(
        `Standard Bridge withdrawal initiated (7-day delay). Tx hash: ${tx.hash}`
      )

      return tx
    } catch (error: any) {
      console.error("Standard Bridge withdrawal failed:", error)
      throw new Error(`Standard Bridge withdrawal failed: ${error.message}`)
    }
  }

  async depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    throw new Error("Method not implemented.")
  }

  async withdrawToL1(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    // withdrawToL1 is an alias for withdraw when on L2
    const chainId = Number(this._ethereumConfig.chainId)
    if (chainId !== 60808 && chainId !== 808813) {
      throw new Error("withdrawToL1 can only be called from BOB network")
    }

    return this.withdraw(amount, opts)
  }

  async approveForCcip(amount: BigNumber): Promise<TransactionResponse | null> {
    if (!this._ccipContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    try {
      // Check current allowance
      const currentAllowance = await this._tokenContract.allowance(
        account,
        this._ccipContract.address
      )

      // Skip if already approved for this amount or more
      if (currentAllowance.gte(amount)) {
        console.log(
          `CCIP approval not needed. Current allowance: ${currentAllowance.toString()}`
        )
        return null
      }

      // Use MaxUint256 for infinite approval (common pattern)
      const approvalAmount = MaxUint256

      console.log(`Approving CCIP contract for ${approvalAmount.toString()}`)

      // Send approval transaction
      const tx = await this._tokenContract.approve(
        this._ccipContract.address,
        approvalAmount
      )

      return tx
    } catch (error: any) {
      console.error("Failed to approve for CCIP:", error)
      throw new Error(`CCIP approval failed: ${error.message}`)
    }
  }

  async approveForStandardBridge(
    amount: BigNumber
  ): Promise<TransactionResponse | null> {
    if (!this._standardBridgeContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    try {
      // Check current allowance
      const currentAllowance = await this._tokenContract.allowance(
        account,
        this._standardBridgeContract.address
      )

      // Skip if already approved for this amount or more
      if (currentAllowance.gte(amount)) {
        console.log(
          `Standard Bridge approval not needed. Current allowance: ${currentAllowance.toString()}`
        )
        return null
      }

      // Use MaxUint256 for infinite approval (common pattern)
      const approvalAmount = MaxUint256

      console.log(
        `Approving Standard Bridge contract for ${approvalAmount.toString()}`
      )

      // Send approval transaction
      const tx = await this._tokenContract.approve(
        this._standardBridgeContract.address,
        approvalAmount
      )

      return tx
    } catch (error) {
      console.error("Failed to approve for Standard Bridge:", error)
      throw new Error(`Standard Bridge approval failed: ${error.message}`)
    }
  }

  async pickPath(amount: BigNumber): Promise<BridgeRoute> {
    // Validate input
    if (amount.lte(0)) {
      throw new Error("Amount must be greater than zero")
    }

    // Get current legacy cap
    const legacyCapRemaining = await this.getLegacyCapRemaining()

    // Case 1: Legacy cap is exhausted - CCIP available
    if (legacyCapRemaining.eq(0)) {
      return "ccip"
    }

    // Case 2: Amount fits within legacy cap - use standard bridge
    if (amount.lte(legacyCapRemaining)) {
      return "standard"
    }

    // Case 3: Amount exceeds legacy cap but cap > 0 - blocked
    throw new Error(
      `Amount ${amount.toString()} exceeds legacy cap remaining ${legacyCapRemaining.toString()}. ` +
        `Please wait for legacy cap to deplete or reduce your withdrawal amount.`
    )
  }

  // Helper method to check if amount can be withdrawn
  async canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }> {
    try {
      const route = await this.pickPath(amount)
      return { canWithdraw: true, route }
    } catch (error: any) {
      return {
        canWithdraw: false,
        reason: error.message,
      }
    }
  }

  async quoteFees(
    amount: BigNumber,
    route?: BridgeRoute
  ): Promise<BridgeQuote> {
    throw new Error("Method not implemented.")
  }

  // Helper method to check allowance without approving
  async getCcipAllowance(): Promise<BigNumber> {
    if (!this._ccipContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    return await this._tokenContract.allowance(
      account,
      this._ccipContract.address
    )
  }

  // Batch approval check for both bridges
  async getAllowances(): Promise<{
    ccip: BigNumber
    standardBridge: BigNumber
  }> {
    if (
      !this._ccipContract ||
      !this._standardBridgeContract ||
      !this._tokenContract
    ) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    const calls = [
      {
        interface: this._tokenContract.interface,
        address: this._tokenContract.address,
        method: "allowance",
        args: [account, this._ccipContract.address],
      },
      {
        interface: this._tokenContract.interface,
        address: this._tokenContract.address,
        method: "allowance",
        args: [account, this._standardBridgeContract.address],
      },
    ]

    const [ccip, standardBridge] = await this._multicall.aggregate(calls)

    return { ccip, standardBridge }
  }

  async getLegacyCapRemaining(): Promise<BigNumber> {
    // Check cache validity
    if (
      this._legacyCapCache &&
      Date.now() - this._legacyCapCache.timestamp < this._cacheExpiry
    ) {
      return this._legacyCapCache.value
    }

    // Ensure contracts are initialized
    if (!this._tokenContract) {
      throw new Error("Token contract not initialized")
    }

    try {
      // Fetch from contract
      const legacyCapRemaining = await this._tokenContract.legacyCapRemaining()

      // Update cache
      this._legacyCapCache = {
        value: legacyCapRemaining,
        timestamp: Date.now(),
      }

      return legacyCapRemaining
    } catch (error: any) {
      console.error("Failed to fetch legacyCapRemaining:", error)

      // If we have stale cache data, return it as fallback
      if (this._legacyCapCache) {
        console.warn("Returning stale cache data due to contract call failure")
        return this._legacyCapCache.value
      }

      throw new Error(`Failed to get legacy cap remaining: ${error.message}`)
    }
  }
}
