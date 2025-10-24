import { BigNumber, Contract, ethers, providers, Signer } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { AddressZero } from "@ethersproject/constants"
import { EthereumConfig } from "../../types"
import { getContract, getArtifact } from "../../utils"
import {
  BobChainSelector,
  EthereumChainSelector,
  SupportedChainIds,
} from "../../../networks/enums/networks"
import { BridgeOptions, BridgeRoute, BridgeQuote } from "../index"

export type NetworkType = "ethereum" | "bob"

export class NetworkContext {
  protected readonly cfg: EthereumConfig
  protected readonly provider: providers.Provider | Signer
  public readonly account?: string
  public readonly chainId: number
  public readonly networkType: NetworkType | undefined

  // Common contracts
  public token!: Contract
  public ccipRouter!: Contract
  public tokenPool!: Contract

  // Bob-specific contracts
  public standardBridge?: Contract
  // L1 Optimism Portal (Ethereum mainnet/Sepolia)
  public optimismPortal?: Contract

  // Cache for legacy cap (Bob only)
  private _legacyCapCache: { value: BigNumber; timestamp: number } | null = null
  private readonly _cacheExpiry = 60000 // 1 minute

  constructor(cfg: EthereumConfig) {
    this.cfg = cfg
    this.provider = cfg.ethereumProviderOrSigner
    this.account = cfg.account
    this.chainId = Number(cfg.chainId)
    this.networkType = this.determineNetworkType()
    if (this.networkType) {
      this.initContracts()
    }
  }

  private determineNetworkType(): NetworkType | undefined {
    if (
      this.chainId === SupportedChainIds.Bob ||
      this.chainId === SupportedChainIds.BobSepolia
    ) {
      return "bob"
    } else if (
      this.chainId === SupportedChainIds.Ethereum ||
      this.chainId === SupportedChainIds.Sepolia
    ) {
      return "ethereum"
    }
    console.warn(
      `Unsupported network: chainId ${this.chainId}. Bridge only supports Bob (60808/808813) and Ethereum (1/11155111)`
    )
  }

  protected initContracts(): void {
    const { chainId, shouldUseTestnetDevelopmentContracts, account } = this.cfg

    const tokenPoolArtifact = getArtifact(
      "TokenPool",
      chainId as number,
      shouldUseTestnetDevelopmentContracts
    )
    const ccipRouterArtifact = getArtifact(
      "CCIPRouter",
      chainId as number,
      shouldUseTestnetDevelopmentContracts
    )
    const tokenArtifact = getArtifact(
      this.networkType === "bob" ? "OptimismMintableUpgradableTBTC" : "TBTC",
      chainId as number,
      shouldUseTestnetDevelopmentContracts
    )

    if (!ccipRouterArtifact || !tokenArtifact || !tokenPoolArtifact) {
      throw new Error(
        `Bridge-related artifacts not found for ${this.networkType} network`
      )
    }

    this.tokenPool = getContract(
      tokenPoolArtifact.address,
      tokenPoolArtifact.abi,
      this.provider,
      account
    )
    this.ccipRouter = getContract(
      ccipRouterArtifact.address,
      ccipRouterArtifact.abi,
      this.provider,
      account
    )
    this.token = getContract(
      tokenArtifact.address,
      tokenArtifact.abi,
      this.provider,
      account
    )

    // Load Standard Bridge - Bob only
    if (this.networkType === "bob") {
      const standardBridgeArtifact = getArtifact(
        "StandardBridge",
        chainId as number,
        shouldUseTestnetDevelopmentContracts
      )

      if (!standardBridgeArtifact) {
        throw new Error("Standard Bridge artifact not found for Bob network")
      }

      this.standardBridge = getContract(
        standardBridgeArtifact.address,
        standardBridgeArtifact.abi,
        this.provider,
        account
      )
    }

    // Load OptimismPortal on Ethereum/Sepolia
    if (this.networkType === "ethereum") {
      const optimismPortalArtifact = getArtifact(
        "OptimismPortal",
        chainId as number,
        shouldUseTestnetDevelopmentContracts
      )
      if (optimismPortalArtifact) {
        this.optimismPortal = getContract(
          optimismPortalArtifact.address,
          optimismPortalArtifact.abi,
          this.provider,
          account
        )
      } else {
        console.warn("OptimismPortal artifact not found")
      }
    }

    console.log(`${this.networkType} network contracts initialized:`, {
      token: !!this.token,
      tokenAddress: this.token?.address,
      ccipRouter: !!this.ccipRouter,
      ccipRouterAddress: this.ccipRouter?.address,
      tokenPool: !!this.tokenPool,
      tokenPoolAddress: this.tokenPool?.address,
      standardBridge: !!this.standardBridge,
      standardBridgeAddress: this.standardBridge?.address,
      optimismPortal: !!this.optimismPortal,
      optimismPortalAddress: this.optimismPortal?.address,
    })
  }

  protected isMainnet(): boolean {
    return (
      this.chainId === SupportedChainIds.Bob ||
      this.chainId === SupportedChainIds.Ethereum
    )
  }

  protected isTestnet(): boolean {
    return (
      this.chainId === SupportedChainIds.BobSepolia ||
      this.chainId === SupportedChainIds.Sepolia
    )
  }

  /**
   * Get the CCIP chain selector for the destination network
   * @param {number} [targetChainId] - Optional target chain ID. If not provided, determines based on current network
   * @return {string} The CCIP chain selector for the destination network
   */
  protected getDestinationChainSelector(targetChainId?: number): string {
    // If no target specified, determine based on current network
    if (!targetChainId) {
      // If on Ethereum/Sepolia -> Bob/BobSepolia
      if (
        this.chainId === SupportedChainIds.Ethereum ||
        this.chainId === SupportedChainIds.Sepolia
      ) {
        return this.isMainnet()
          ? BobChainSelector.Bob
          : BobChainSelector.BobSepolia
      }
      // If on Bob/BobSepolia -> Ethereum/Sepolia
      else if (
        this.chainId === SupportedChainIds.Bob ||
        this.chainId === SupportedChainIds.BobSepolia
      ) {
        return this.isMainnet()
          ? EthereumChainSelector.Ethereum
          : EthereumChainSelector.Sepolia
      }
    }

    // If target specified, return its selector
    switch (targetChainId) {
      case SupportedChainIds.Ethereum:
        return EthereumChainSelector.Ethereum
      case SupportedChainIds.Sepolia:
        return EthereumChainSelector.Sepolia
      case SupportedChainIds.Bob:
        return BobChainSelector.Bob
      case SupportedChainIds.BobSepolia:
        return BobChainSelector.BobSepolia
      default:
        throw new Error(`Unsupported target chain ID: ${targetChainId}`)
    }
  }

  /**
   * Approves CCIP Router to spend tokens (works on both networks)
   * @param {BigNumber} amount - Amount to approve
   * @return {Promise<TransactionResponse | null>} Transaction response or null if already approved
   */
  async approveForCcip(amount: BigNumber): Promise<TransactionResponse | null> {
    if (!this.account) {
      throw new Error("No account connected")
    }

    try {
      const currentAllowance = await this.getCcipAllowance()

      if (currentAllowance.gte(amount)) {
        console.log(
          `CCIP Router approval not needed. Current allowance: ${currentAllowance.toString()}`
        )
        return null
      }
      console.log(`Approving CCIP Router for ${amount.toString()}`)

      const tx = await this.token.approve(this.ccipRouter.address, amount)
      return tx
    } catch (error: any) {
      console.error("Failed to approve for CCIP Router:", error)
      throw new Error(`CCIP Router approval failed: ${error.message}`)
    }
  }

  /**
   * Gets current CCIP Router allowance
   */
  async getCcipAllowance(): Promise<BigNumber> {
    if (!this.account) {
      throw new Error("No account connected")
    }

    const allowance = await this.token.allowance(
      this.account,
      this.ccipRouter.address
    )
    return allowance
  }

  /**
   * Withdraws tBTC from Bob network to Ethereum L1.
   * @param {BigNumber} amount - Amount of tBTC to withdraw.
   * @param {BridgeOptions} [opts] - Optional transaction parameters.
   * @throws Error if called on Ethereum network.
   */
  async withdrawFromBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    if (this.networkType !== "bob") {
      throw new Error(
        "withdrawFromBob() can only be called from Bob network. Please switch to Bob network."
      )
    }

    if (amount.lte(0)) {
      throw new Error("Withdrawal amount must be greater than zero")
    }

    // Determine the appropriate route
    const route = await this.pickPath(amount)

    // Route to the appropriate withdrawal method
    if (route === "ccip") {
      return this._withdrawViaCcip(amount, opts)
    } else {
      return this._withdrawViaStandard(amount, opts)
    }
  }

  /**
   * Deposits tBTC from Ethereum L1 to Bob network
   * @param {BigNumber} amount - Amount of tBTC to deposit.
   * @param {BridgeOptions} [opts] - Optional transaction parameters.
   * @throws Error if called on Bob network
   */
  async depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    if (this.networkType !== "ethereum") {
      throw new Error(
        "depositToBob() can only be called from Ethereum L1. Please switch to Ethereum network."
      )
    }

    // Validate amount
    if (amount.lte(0)) {
      throw new Error("Deposit amount must be greater than zero")
    }

    if (!this.account) {
      throw new Error("No account connected")
    }

    const recipient = opts?.recipient || this.account

    try {
      // Check and handle token approval
      const approvalTx = await this.approveForCcip(amount)
      if (approvalTx) {
        console.log(`Waiting for CCIP Router approval tx: ${approvalTx.hash}`)
        await approvalTx.wait()
      }

      const destinationChainSelector = this.getDestinationChainSelector()

      // Build EVM2AnyMessage for CCIP
      const tokenAmounts = [
        {
          token: this.token.address,
          amount: amount,
        },
      ]

      // For L1 to Bob, we always use the standard encoded format
      const encodedReceiver = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [recipient]
      )

      const message = {
        receiver: encodedReceiver,
        data: "0x",
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero,
        extraArgs: this.encodeExtraArgs(200000),
      }

      // Calculate fees
      const fees = await this._quoteCcipBridgingFees(amount, 60 * 60)

      // Build transaction parameters
      // Add 10% buffer to the fee to avoid InsufficientFeeTokenAmount errors
      const feeWithBuffer = fees.fee.mul(110).div(100)
      const txParams: any = {
        value: feeWithBuffer,
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      // Execute CCIP deposit
      const tx = await this.ccipRouter.ccipSend(
        destinationChainSelector,
        message,
        txParams
      )

      console.log(`L1 to Bob CCIP deposit initiated. Tx hash: ${tx.hash}`)
      console.log(`Deposit will arrive on Bob in ~60 minutes`)

      return tx
    } catch (error: any) {
      console.error("L1 to Bob CCIP deposit failed:", error)
      throw new Error(`CCIP deposit failed: ${error.message}`)
    }
  }

  /**
   * Quotes fees for any bridge operation (deposits or withdrawals)
   * @param {BigNumber} amount - Amount of tBTC to deposit or withdraw.
   * @return {Promise<BridgeQuote>} Fee quote with breakdown.
   */
  async quoteFees(amount: BigNumber): Promise<BridgeQuote> {
    if (amount.lte(0)) {
      throw new Error("Amount must be greater than zero")
    }

    const route = await this.pickPath(amount)
    const estimatedTime = this.getBridgingTime(route)

    if (route === "ccip") {
      return this._quoteCcipBridgingFees(amount, estimatedTime)
    } else {
      return this._quoteStandardBridgingFees(amount, estimatedTime)
    }
  }

  /**
   * Checks if amount can be withdrawn (Bob network only)
   * @param {BigNumber} amount - Amount of tBTC to withdraw.
   * @return {Promise<object>} Withdrawal feasibility with canWithdraw, route and reason properties
   * @throws Error if called on Ethereum network
   */
  async canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }> {
    if (this.networkType !== "bob") {
      throw new Error(
        "canWithdraw() can only be called from Bob network. Cannot withdraw from Ethereum."
      )
    }

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

  /**
   * Determines the optimal withdrawal route (Bob network only)
   * @param {BigNumber} amount - Amount of tBTC to withdraw.
   * @return {Promise<BridgeRoute>} Optimal withdrawal route.
   * @throws Error if called on Ethereum network
   */
  async pickPath(amount: BigNumber): Promise<BridgeRoute> {
    if (!this.networkType) {
      throw new Error("Network type not determined")
    }

    if (amount.lte(0)) {
      throw new Error("Amount must be greater than zero")
    }

    // Case 1: Ethereum network - CCIP always available
    if (this.networkType === "ethereum") {
      return "ccip"
    }

    // Case 2: Bob network - check legacy cap
    const legacyCapRemaining = await this.getLegacyCapRemaining()

    // Case 3: Legacy cap is exhausted - CCIP available
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

  /**
   * Gets the remaining legacy cap (Bob network only)
   * @throws Error if called on Ethereum network
   */
  async getLegacyCapRemaining(): Promise<BigNumber> {
    if (this.networkType !== "bob") {
      throw new Error(
        "getLegacyCapRemaining() can only be called from Bob network"
      )
    }

    // Check cache validity
    if (
      this._legacyCapCache &&
      Date.now() - this._legacyCapCache.timestamp < this._cacheExpiry
    ) {
      return this._legacyCapCache.value
    }

    try {
      const legacyCapRemaining = await this.token.legacyCapRemaining()

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

  /**
   * Get withdrawal time estimates
   * @param {BridgeRoute} route - The withdrawal route.
   * @return {number} The estimated withdrawal time in seconds.
   */
  getBridgingTime(route: BridgeRoute): number {
    switch (route) {
      case "ccip":
        return 60 * 60 // ~60 minutes in seconds
      case "standard":
        return 7 * 24 * 60 * 60 // 7 days in seconds
      default:
        throw new Error(`Unknown route: ${route}`)
    }
  }

  // Private methods for internal operations

  private async _withdrawViaCcip(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    if (!this.account) {
      throw new Error("No account connected")
    }

    const recipient = opts?.recipient || this.account

    try {
      // Check and handle token approval
      const approvalTx = await this.approveForCcip(amount)
      if (approvalTx) {
        console.log(`Waiting for CCIP Router approval tx: ${approvalTx.hash}`)
        await approvalTx.wait()
      }

      // Build EVM2AnyMessage for CCIP
      const tokenAmounts = [
        {
          token: this.token.address,
          amount: amount,
        },
      ]

      const destinationChainSelector = this.getDestinationChainSelector()

      const message = {
        receiver: ethers.utils.defaultAbiCoder.encode(["address"], [recipient]),
        data: "0x",
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero,
        extraArgs: this.encodeExtraArgs(200000),
      }

      // Calculate fees
      const fees = await this.ccipRouter.getFee(
        destinationChainSelector,
        message
      )

      // Send CCIP message
      // Add 10% buffer to the fee to avoid InsufficientFeeTokenAmount errors
      const feeWithBuffer = fees.mul(110).div(100)

      const txParams: any = {
        value: feeWithBuffer,
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      const tx = await this.ccipRouter.ccipSend(
        destinationChainSelector,
        message,
        txParams
      )

      console.log(`CCIP withdrawal initiated. Tx hash: ${tx.hash}`)
      return tx
    } catch (error: any) {
      console.error("CCIP withdrawal failed:", error)
      throw new Error(`CCIP withdrawal failed: ${error.message}`)
    }
  }

  private async _withdrawViaStandard(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    if (!this.account) {
      throw new Error("No account connected")
    }

    if (!this.standardBridge) {
      throw new Error("Standard bridge not available")
    }

    const recipient = opts?.recipient || this.account

    try {
      const txParams: any = {
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      const tx = await this.standardBridge.withdrawTo(
        this.token.address,
        recipient,
        amount,
        opts?.deadline || 0,
        "0x",
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

  private async _quoteCcipBridgingFees(
    amount: BigNumber,
    estimatedTime: number
  ): Promise<BridgeQuote> {
    try {
      const tokenAmounts = [
        {
          token: this.token.address,
          amount: amount,
        },
      ]
      const destinationChainSelector = this.getDestinationChainSelector()

      const message = {
        receiver: ethers.utils.defaultAbiCoder.encode(
          ["address"],
          [this.account || AddressZero]
        ),
        data: "0x",
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero,
        extraArgs: this.encodeExtraArgs(200000),
      }

      const ccipFee = await this.ccipRouter.getFee(
        destinationChainSelector,
        message
      )

      return {
        route: "ccip",
        fee: ccipFee,
        estimatedTime: estimatedTime,
        breakdown: {
          ccipFee: ccipFee,
          standardFee: BigNumber.from(0),
        },
      }
    } catch (error) {
      console.error("Failed to get CCIP fee:", error)
      // Fallback to estimated fee if contract call fails
      const estimatedFee = amount.mul(3).div(1000) // 0.3%

      return {
        route: "ccip",
        fee: estimatedFee,
        estimatedTime: estimatedTime,
        breakdown: {
          ccipFee: estimatedFee,
          standardFee: BigNumber.from(0),
        },
      }
    }
  }

  private async _quoteStandardBridgingFees(
    amount: BigNumber,
    estimatedTime: number
  ): Promise<BridgeQuote> {
    const gasPrice = await this.provider.getGasPrice()
    const estimatedGas = BigNumber.from(200000)
    const standardFee = gasPrice.mul(estimatedGas)

    return {
      route: "standard",
      fee: standardFee,
      estimatedTime: estimatedTime,
      breakdown: {
        standardFee: standardFee,
        ccipFee: BigNumber.from(0),
      },
    }
  }

  private encodeExtraArgs(gasLimit: number): string {
    const abiCoder = new ethers.utils.AbiCoder()
    // CCIP requires extraArgs to be prefixed with a version tag
    // For EVMExtraArgsV1, we only encode gasLimit (uint256)
    const encodedArgs = abiCoder.encode(["uint256"], [gasLimit])
    // EVMExtraArgsV1 tag is 0x97a657c9 (required by CCIP router)
    const evmExtraArgsV1Tag = "0x97a657c9"
    // Concatenate tag with encoded args (removing 0x prefix from encodedArgs)
    return evmExtraArgsV1Tag + encodedArgs.slice(2)
  }
}
