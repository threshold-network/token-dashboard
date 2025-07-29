import { BigNumber, Contract, providers, Signer, ethers } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { MaxUint256, AddressZero } from "@ethersproject/constants"
import { EthereumConfig, CrossChainConfig } from "../types"
import { IMulticall } from "../multicall"
import { getContract, getArtifact } from "../utils"
import { SupportedChainIds } from "../../networks/enums/networks"

export interface IBridge {
  // Core bridge methods - SIMPLIFIED API
  withdraw(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> // Smart routing - handles both CCIP and Standard Bridge
  depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse>

  // Approval helpers
  approveForCcip(amount: BigNumber): Promise<TransactionResponse | null>

  // Routing and quotes
  pickPath(amount: BigNumber): Promise<BridgeRoute> // Public for UI decisions
  quoteFees(amount: BigNumber, route?: BridgeRoute): Promise<BridgeQuote>

  // Utilities
  getLegacyCapRemaining(): Promise<BigNumber>
  canWithdraw(amount: BigNumber): Promise<{
    canWithdraw: boolean
    route?: BridgeRoute
    reason?: string
  }>
  getCcipAllowance(): Promise<BigNumber>
  getWithdrawalTime(route: BridgeRoute): number
  quoteDepositFees(amount: BigNumber): Promise<BridgeQuote>
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
  private _multicall: IMulticall
  private _ccipRouterContract: Contract | null = null // Renamed from _ccipContract
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

    // Map Bob chain ID to mainnet/testnet for artifact loading
    const isBobMainnet = chainId === 60808
    const isBobTestnet = chainId === 808813

    if (!isBobMainnet && !isBobTestnet) {
      console.warn("Bridge: Not on Bob network, contracts will be null")
      return
    }

    // Use Bob chain ID directly for artifact loading
    const bobChainId = Number(chainId)

    // Get provider
    const provider = ethereumProviderOrSigner

    // Load CCIP Router (users interact with this, not pools)
    const ccipRouterArtifact = getArtifact(
      "CCIPRouter",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    // Get the correct router address based on network
    if (ccipRouterArtifact) {
      const routerAddress = isBobMainnet
        ? ccipRouterArtifact.mainnet?.address
        : ccipRouterArtifact.testnet?.address

      if (
        routerAddress &&
        routerAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        this._ccipRouterContract = getContract(
          routerAddress,
          ccipRouterArtifact.abi,
          provider,
          account
        )
      } else {
        console.warn("CCIP Router address not configured for this network")
        this._ccipRouterContract = null
      }
    }

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

    // Load Bob tBTC Token (OptimismMintableUpgradableTBTC)
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
      ccipRouter: !!this._ccipRouterContract,
      standardBridge: !!this._standardBridgeContract,
      token: !!this._tokenContract,
    })
  }

  // Helper method to check if contracts are initialized
  private _ensureContractsInitialized(): void {
    if (
      !this._ccipRouterContract ||
      !this._standardBridgeContract ||
      !this._tokenContract
    ) {
      throw new Error(
        "Bridge contracts not initialized. Ensure you're on Bob network."
      )
    }
  }

  /**
   * Withdraws tBTC from Bob network to Ethereum L1.
   * Automatically routes through CCIP (fast, ~60 min) or Standard Bridge (slow, 7 days)
   * based on the legacyCapRemaining value.
   *
   * @param {BigNumber} amount - Amount of tBTC to withdraw
   * @param {BridgeOptions} [opts] - Optional transaction parameters
   * @return {Promise<TransactionResponse>} Transaction response
   * @throws Error if amount exceeds legacy cap but cap > 0
   */
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
   * Private method to handle CCIP withdrawals
   * @private
   * @param {BigNumber} amount - Amount to withdraw
   * @param {BridgeOptions} [opts] - Optional transaction parameters
   * @return {Promise<TransactionResponse>} Transaction response
   */
  private async _withdrawViaCcip(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    // Use recipient from options or default to connected account
    const recipient = opts?.recipient || account

    try {
      // Step 1: Check and handle token approval for Router
      const approvalTx = await this.approveForCcip(amount)
      if (approvalTx) {
        console.log(`Waiting for CCIP Router approval tx: ${approvalTx.hash}`)
        await approvalTx.wait()
      }

      // Step 3: Build EVM2AnyMessage for CCIP
      const tokenAmounts = [
        {
          token: this._tokenContract!.address,
          amount: amount,
        },
      ]

      // Determine destination chain selector based on network
      const isBobMainnet = this._ethereumConfig.chainId === 60808
      // Get Ethereum chain selector from L1 CCIP Router artifact
      const ethChainId = isBobMainnet
        ? SupportedChainIds.Ethereum
        : SupportedChainIds.Sepolia
      const ethArtifact = getArtifact(
        "L1CCIPRouter",
        ethChainId,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!ethArtifact || !ethArtifact.chainSelector) {
        throw new Error(
          "Ethereum chain selector not found in L1CCIPRouter artifact"
        )
      }

      const destinationChainSelector = ethArtifact.chainSelector

      // Encode receiver address for CCIP
      const encodedReceiver = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [recipient]
      )

      const message = {
        receiver: encodedReceiver,
        data: "0x", // No additional data needed for simple transfer
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero, // Default to native token
        extraArgs: this._encodeExtraArgs(200000, false), // gasLimit, strict
      }

      // Step 4: Calculate fees
      const fees = await this._ccipRouterContract!.getFee(
        destinationChainSelector,
        message
      )

      // Step 5: Send CCIP message
      const txParams: any = {
        // Only include value if paying in native token
        ...{ value: fees },
        // Add gas parameters if provided
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      const tx = await this._ccipRouterContract!.ccipSend(
        destinationChainSelector,
        message,
        txParams
      )

      console.log(`CCIP withdrawal initiated. Tx hash: ${tx.hash}`)
      console.log(`Message ID: ${tx.value || "pending"}`)

      return tx
    } catch (error: any) {
      console.error("CCIP withdrawal failed:", error)
      throw new Error(`CCIP withdrawal failed: ${error.message}`)
    }
  }

  /**
   * Private method to handle Standard Bridge withdrawals
   * @private
   * @param {BigNumber} amount - Amount to withdraw
   * @param {BridgeOptions} [opts] - Optional transaction parameters
   * @return {Promise<TransactionResponse>} Transaction response
   */
  private async _withdrawViaStandard(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    // Use recipient from options or default to connected account
    const recipient = opts?.recipient || account

    try {
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

  async approveForCcip(amount: BigNumber): Promise<TransactionResponse | null> {
    if (!this._ccipRouterContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    try {
      // Check current allowance for CCIP Router (not pool!)
      const ccip = await this.getCcipAllowance()

      // Skip if already approved for this amount or more
      if (ccip.gte(amount)) {
        console.log(
          `CCIP Router approval not needed. Current allowance: ${ccip.toString()}`
        )
        return null
      }

      // Use MaxUint256 for infinite approval (common pattern)
      const approvalAmount = MaxUint256

      console.log(`Approving CCIP Router for ${approvalAmount.toString()}`)

      // Send approval transaction to CCIP Router
      const tx = await this._tokenContract.approve(
        this._ccipRouterContract.address,
        approvalAmount
      )

      return tx
    } catch (error: any) {
      console.error("Failed to approve for CCIP Router:", error)
      throw new Error(`CCIP Router approval failed: ${error.message}`)
    }
  }

  /**
   * Determines the optimal withdrawal route based on the amount and legacyCapRemaining.
   * This is a public method that can be called by frontend to preview which route will be used.
   *
   * @param {BigNumber} amount - Amount of tBTC to withdraw
   * @return {Promise<BridgeRoute>} "ccip" for fast path (~60 min) or "standard" for slow path (7 days)
   * @throws Error if amount exceeds legacy cap but cap > 0 (blocked scenario)
   *
   * @example
   * ```typescript
   * const route = await bridge.pickPath(amount);
   * if (route === "ccip") {
   *   console.log("Fast withdrawal available (~60 minutes)");
   * } else {
   *   console.log("Standard withdrawal will be used (7 days)");
   * }
   * ```
   */
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
    // Validate amount
    if (amount.lte(0)) {
      throw new Error("Amount must be greater than zero")
    }

    // Determine route if not provided
    const actualRoute = route || (await this.pickPath(amount))

    // Get base time estimate
    const estimatedTime = this.getWithdrawalTime(actualRoute)

    try {
      switch (actualRoute) {
        case "ccip":
          return await this._quoteCcipFees(amount, estimatedTime)

        case "standard":
          return await this._quoteStandardFees(amount, estimatedTime)

        default:
          throw new Error(`Unknown route: ${actualRoute}`)
      }
    } catch (error: any) {
      console.error("Failed to quote fees:", error)
      throw new Error(`Fee quotation failed: ${error.message}`)
    }
  }

  // Batch approval check for both bridges
  async getCcipAllowance(): Promise<BigNumber> {
    if (!this._ccipRouterContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    const allowance = await this._tokenContract.allowance(
      account,
      this._ccipRouterContract.address
    )

    return allowance
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

  // Get withdrawal time estimates
  getWithdrawalTime(route: BridgeRoute): number {
    switch (route) {
      case "ccip":
        return 60 * 60 // ~60 minutes in seconds
      case "standard":
        return 7 * 24 * 60 * 60 // 7 days in seconds
      default:
        throw new Error(`Unknown route: ${route}`)
    }
  }

  // Helper method to encode CCIP extra args
  private _encodeExtraArgs(gasLimit: number, strict: boolean): string {
    // Encode EVMExtraArgsV1 structure
    // The ABI encoding follows: ['uint256', 'bool']
    const abiCoder = new ethers.utils.AbiCoder()
    return abiCoder.encode(["uint256", "bool"], [gasLimit, strict])
  }

  private async _quoteCcipFees(
    amount: BigNumber,
    estimatedTime: number
  ): Promise<BridgeQuote> {
    if (!this._ccipRouterContract) {
      throw new Error("CCIP Router not initialized")
    }

    try {
      // Build message for fee calculation
      const tokenAmounts = [
        {
          token: this._tokenContract!.address,
          amount: amount,
        },
      ]

      // Determine destination chain selector
      const isBobMainnet = this._ethereumConfig.chainId === 60808
      // Get Ethereum chain selector from L1 CCIP Router artifact
      const ethChainId = isBobMainnet
        ? SupportedChainIds.Ethereum
        : SupportedChainIds.Sepolia
      const ethArtifact = getArtifact(
        "L1CCIPRouter",
        ethChainId,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!ethArtifact || !ethArtifact.chainSelector) {
        throw new Error(
          "Ethereum chain selector not found in L1CCIPRouter artifact"
        )
      }

      const destinationChainSelector = ethArtifact.chainSelector

      // Encode receiver address
      const encodedReceiver = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [this._ethereumConfig.account || AddressZero]
      )

      const message = {
        receiver: encodedReceiver,
        data: "0x",
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero, // Default to native token
        extraArgs: this._encodeExtraArgs(200000, false),
      }

      // Get fee from router
      const ccipFee = await this._ccipRouterContract.getFee(
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
      // Fallback to estimated fee if contract call fails
      // CCIP typically charges 0.1-0.5% of transfer amount
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

  private async _quoteStandardFees(
    amount: BigNumber,
    estimatedTime: number
  ): Promise<BridgeQuote> {
    // Standard bridge typically has minimal fees
    // Main cost is L2 gas for the withdrawal transaction
    const gasPrice =
      await this._ethereumConfig.ethereumProviderOrSigner.getGasPrice()
    const estimatedGas = BigNumber.from(200000) // Typical L2 withdrawal gas
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

  // Special case for L1 to Bob deposit fees
  async quoteDepositFees(amount: BigNumber): Promise<BridgeQuote> {
    try {
      // L1 to L2 deposits have different fee structure
      // Main costs: L1 gas + L2 execution gas

      const l1GasPrice =
        await this._ethereumConfig.ethereumProviderOrSigner.getGasPrice()
      const estimatedL1Gas = BigNumber.from(150000) // Typical deposit gas
      const l1Fee = l1GasPrice.mul(estimatedL1Gas)

      // L2 execution cost (paid on L1)
      const l2GasLimit = BigNumber.from(200000)
      const l2GasPrice = BigNumber.from(1000000) // 0.001 gwei typical for L2
      const l2Fee = l2GasLimit.mul(l2GasPrice)

      const totalFee = l1Fee.add(l2Fee)

      return {
        route: "standard", // Deposits use standard bridge
        fee: totalFee,
        estimatedTime: 15 * 60, // ~15 minutes for deposit
        breakdown: {
          standardFee: totalFee,
          ccipFee: BigNumber.from(0),
        },
      }
    } catch (error: any) {
      throw new Error(`Fee quotation failed: ${error.message}`)
    }
  }

  async depositToBob(
    amount: BigNumber,
    opts?: BridgeOptions
  ): Promise<TransactionResponse> {
    // Validate we're on L1
    const chainId = Number(this._ethereumConfig.chainId)
    const isMainnet = chainId === SupportedChainIds.Ethereum
    const isSepolia = chainId === SupportedChainIds.Sepolia

    if (!isMainnet && !isSepolia) {
      throw new Error(
        "depositToBob can only be called from Ethereum L1 (mainnet or Sepolia)"
      )
    }

    // Validate amount
    if (amount.lte(0)) {
      throw new Error("Deposit amount must be greater than zero")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    // Use recipient from options or default to connected account
    const recipient = opts?.recipient || account

    try {
      // Get L1 CCIP Router contract
      const l1CCIPRouterArtifact = getArtifact(
        "L1CCIPRouter",
        chainId,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!l1CCIPRouterArtifact) {
        throw new Error("L1 CCIP Router artifact not found")
      }

      const l1CCIPRouterContract = getContract(
        l1CCIPRouterArtifact.address,
        l1CCIPRouterArtifact.abi,
        this._ethereumConfig.ethereumProviderOrSigner,
        this._ethereumConfig.account
      )

      // Get L1 tBTC token contract
      const l1TokenArtifact = getArtifact(
        "TBTC",
        chainId,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!l1TokenArtifact) {
        throw new Error("L1 TBTC token artifact not found")
      }

      const l1TokenContract = getContract(
        l1TokenArtifact.address,
        l1TokenArtifact.abi,
        this._ethereumConfig.ethereumProviderOrSigner,
        this._ethereumConfig.account
      )

      // Check and handle L1 token approval for CCIP Router
      const currentAllowance = await l1TokenContract.allowance(
        account,
        l1CCIPRouterContract.address
      )

      if (currentAllowance.lt(amount)) {
        console.log(`Approving L1 CCIP Router for ${amount.toString()} tBTC`)
        const approvalTx = await l1TokenContract.approve(
          l1CCIPRouterContract.address,
          MaxUint256
        )
        console.log(
          `Waiting for L1 CCIP Router approval tx: ${approvalTx.hash}`
        )
        await approvalTx.wait()
      }

      // Get Bob chain selector from L1 CCIP Router artifact
      // This ensures we use the correct selector for the target Bob network
      const bobArtifact = getArtifact(
        "CCIPRouter",
        isMainnet ? SupportedChainIds.Bob : SupportedChainIds.BobSepolia,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!bobArtifact || !bobArtifact.chainSelector) {
        throw new Error("Bob chain selector not found in CCIPRouter artifact")
      }

      const bobChainSelector = bobArtifact.chainSelector

      // Build EVM2AnyMessage for CCIP
      const tokenAmounts = [
        {
          token: l1TokenArtifact.address,
          amount: amount,
        },
      ]

      // Encode receiver address for CCIP
      const encodedReceiver = ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [recipient]
      )

      const message = {
        receiver: encodedReceiver,
        data: "0x", // No additional data needed for simple transfer
        tokenAmounts: tokenAmounts,
        feeToken: AddressZero, // Default to native token
        extraArgs: this._encodeExtraArgs(200000, false), // gasLimit, strict
      }

      // Calculate fees
      const fees = await l1CCIPRouterContract.getFee(bobChainSelector, message)

      // Build transaction parameters
      const txParams: any = {
        // Only include value if paying in native token
        ...{ value: fees },
        // Add gas parameters if provided
        ...(opts?.gasLimit && { gasLimit: opts.gasLimit }),
        ...(opts?.gasPrice && { gasPrice: opts.gasPrice }),
        ...(opts?.maxFeePerGas && { maxFeePerGas: opts.maxFeePerGas }),
        ...(opts?.maxPriorityFeePerGas && {
          maxPriorityFeePerGas: opts.maxPriorityFeePerGas,
        }),
      }

      // Execute CCIP deposit
      const tx = await l1CCIPRouterContract.ccipSend(
        bobChainSelector,
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
}
