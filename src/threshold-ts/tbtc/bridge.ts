import { BigNumber, Contract, providers, Signer, ethers } from "ethers"
import { TransactionResponse } from "@ethersproject/abstract-provider"
import { MaxUint256, AddressZero } from "@ethersproject/constants"
import { EthereumConfig, CrossChainConfig } from "../types"
import { IMulticall } from "../multicall"
import { getContract, getArtifact } from "../utils"
import { SupportedChainIds } from "../../networks/enums/networks"

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
  useLinkForFees?: boolean // New: option to pay CCIP fees in LINK token
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

// Fee token addresses on BOB
const FEE_TOKENS = {
  LINK: {
    mainnet: "0x5aB885CDa7216b163fb6F813DEC1E1532516c833",
    testnet: "0x0000000000000000000000000000000000000000",
  },
  WETH: {
    mainnet: "0x4200000000000000000000000000000000000006",
    testnet: "0x0000000000000000000000000000000000000000",
  },
}

export class Bridge implements IBridge {
  private _ethereumConfig: EthereumConfig
  private _crossChainConfig: CrossChainConfig
  private _multicall: IMulticall
  private _ccipRouterContract: Contract | null = null // Renamed from _ccipContract
  private _standardBridgeContract: Contract | null = null
  private _tokenContract: Contract | null = null
  private _linkTokenContract: Contract | null = null // New: for LINK fee payments
  private _burnFromMintPoolAddress: string | null = null // Reference only
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

    // Load CCIP Router (users interact with this, not pools)
    const ccipRouterArtifact = getArtifact(
      "CCIPRouter",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    // Get the correct router address based on network
    if (ccipRouterArtifact) {
      const routerAddress = isBOBMainnet
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

    // Load BurnFromMintTokenPool address for reference (we don't interact with it directly)
    const burnFromMintPoolArtifact = getArtifact(
      "BurnFromMintTokenPool",
      bobChainId,
      shouldUseTestnetDevelopmentContracts
    )

    if (burnFromMintPoolArtifact) {
      this._burnFromMintPoolAddress = isBOBMainnet
        ? burnFromMintPoolArtifact.mainnet?.address
        : burnFromMintPoolArtifact.testnet?.address
    }

    // Load LINK token for fee payments
    const linkAddress = isBOBMainnet
      ? FEE_TOKENS.LINK.mainnet
      : FEE_TOKENS.LINK.testnet

    if (
      linkAddress &&
      linkAddress !== "0x0000000000000000000000000000000000000000"
    ) {
      // Use standard ERC20 ABI for LINK token
      const erc20Abi = [
        "function approve(address spender, uint256 amount) returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)",
        "function balanceOf(address owner) view returns (uint256)",
      ]
      this._linkTokenContract = getContract(
        linkAddress,
        erc20Abi,
        provider,
        account
      )
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
      ccipRouter: !!this._ccipRouterContract,
      standardBridge: !!this._standardBridgeContract,
      token: !!this._tokenContract,
      linkToken: !!this._linkTokenContract,
      burnFromMintPool: this._burnFromMintPoolAddress,
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

      // Step 2: Handle LINK approval if using LINK for fees
      const useLinkForFees = opts?.useLinkForFees && this._linkTokenContract
      let feeToken = AddressZero // Default to native token

      if (useLinkForFees) {
        feeToken = this._linkTokenContract!.address

        // Check and handle LINK approval for Router
        const linkAllowance = await this._linkTokenContract!.allowance(
          account,
          this._ccipRouterContract!.address
        )

        // We'll calculate fees first to know how much LINK to approve
        // For now, approve a reasonable amount if needed
        const estimatedLinkFee = amount.mul(3).div(1000) // 0.3% estimate

        if (linkAllowance.lt(estimatedLinkFee)) {
          console.log(`Approving LINK for CCIP Router fees`)
          const linkApprovalTx = await this._linkTokenContract!.approve(
            this._ccipRouterContract!.address,
            MaxUint256
          )
          await linkApprovalTx.wait()
        }
      }

      // Step 3: Build EVM2AnyMessage for CCIP
      const tokenAmounts = [
        {
          token: this._tokenContract!.address,
          amount: amount,
        },
      ]

      // Determine destination chain selector based on network
      const isBOBMainnet = this._ethereumConfig.chainId === 60808
      // Get Ethereum chain selector from L1 CCIP Router artifact
      const ethChainId = isBOBMainnet
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
        feeToken: feeToken, // Use LINK or native token based on user preference
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
        ...(feeToken === AddressZero && { value: fees }),
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
    if (!this._ccipRouterContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    try {
      // Check current allowance for CCIP Router (not pool!)
      const currentAllowance = await this._tokenContract.allowance(
        account,
        this._ccipRouterContract.address
      )

      // Skip if already approved for this amount or more
      if (currentAllowance.gte(amount)) {
        console.log(
          `CCIP Router approval not needed. Current allowance: ${currentAllowance.toString()}`
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
    route?: BridgeRoute,
    useLinkForFees?: boolean
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
          return await this._quoteCcipFees(
            amount,
            estimatedTime,
            useLinkForFees
          )

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

  // Helper method to check allowance without approving
  async getCcipAllowance(): Promise<BigNumber> {
    if (!this._ccipRouterContract || !this._tokenContract) {
      throw new Error("Contracts not initialized")
    }

    const account = this._ethereumConfig.account
    if (!account) {
      throw new Error("No account connected")
    }

    return await this._tokenContract.allowance(
      account,
      this._ccipRouterContract.address
    )
  }

  // Batch approval check for both bridges
  async getAllowances(): Promise<{
    ccip: BigNumber
    standardBridge: BigNumber
  }> {
    if (
      !this._ccipRouterContract ||
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
        args: [account, this._ccipRouterContract.address],
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
    estimatedTime: number,
    useLinkForFees?: boolean
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
      const isBOBMainnet = this._ethereumConfig.chainId === 60808
      // Get Ethereum chain selector from L1 CCIP Router artifact
      const ethChainId = isBOBMainnet
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

      // Use LINK token if requested and available
      const feeToken =
        useLinkForFees && this._linkTokenContract
          ? this._linkTokenContract.address
          : AddressZero

      const message = {
        receiver: encodedReceiver,
        data: "0x",
        tokenAmounts: tokenAmounts,
        feeToken: feeToken, // Calculate for specified fee token
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

  // Special case for L1 to BOB deposit fees
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

      // Handle LINK token approval if using LINK for fees
      const useLinkForFees = opts?.useLinkForFees
      let feeToken = AddressZero // Default to native token

      if (useLinkForFees) {
        // Get LINK token contract
        const linkTokenArtifact = getArtifact(
          "LinkToken",
          chainId,
          this._ethereumConfig.shouldUseTestnetDevelopmentContracts
        )

        if (!linkTokenArtifact) {
          throw new Error("LINK token artifact not found")
        }

        const linkTokenContract = getContract(
          linkTokenArtifact.address,
          linkTokenArtifact.abi,
          this._ethereumConfig.ethereumProviderOrSigner,
          this._ethereumConfig.account
        )

        feeToken = linkTokenContract.address

        // We'll approve LINK after calculating fees
      }

      // Get BOB chain selector from L1 CCIP Router artifact
      // This ensures we use the correct selector for the target BOB network
      const bobArtifact = getArtifact(
        "CCIPRouter",
        isMainnet ? SupportedChainIds.Bob : SupportedChainIds.BobSepolia,
        this._ethereumConfig.shouldUseTestnetDevelopmentContracts
      )

      if (!bobArtifact || !bobArtifact.chainSelector) {
        throw new Error("BOB chain selector not found in CCIPRouter artifact")
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
        feeToken: feeToken,
        extraArgs: this._encodeExtraArgs(200000, false), // gasLimit, strict
      }

      // Calculate fees
      const fees = await l1CCIPRouterContract.getFee(bobChainSelector, message)

      // Handle LINK approval if using LINK for fees
      if (useLinkForFees && feeToken !== AddressZero) {
        const linkTokenArtifact = getArtifact(
          "LinkToken",
          chainId,
          this._ethereumConfig.shouldUseTestnetDevelopmentContracts
        )

        const linkTokenContract = getContract(
          linkTokenArtifact!.address,
          linkTokenArtifact!.abi,
          this._ethereumConfig.ethereumProviderOrSigner,
          this._ethereumConfig.account
        )

        const linkAllowance = await linkTokenContract.allowance(
          account,
          l1CCIPRouterContract.address
        )

        if (linkAllowance.lt(fees)) {
          console.log(`Approving LINK for CCIP fees`)
          const linkApprovalTx = await linkTokenContract.approve(
            l1CCIPRouterContract.address,
            MaxUint256
          )
          await linkApprovalTx.wait()
        }
      }

      // Build transaction parameters
      const txParams: any = {
        // Only include value if paying in native token
        ...(feeToken === AddressZero && { value: fees }),
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

      console.log(`L1 to BOB CCIP deposit initiated. Tx hash: ${tx.hash}`)
      console.log(`Deposit will arrive on BOB in ~60 minutes`)

      return tx
    } catch (error: any) {
      console.error("L1 to BOB CCIP deposit failed:", error)
      throw new Error(`CCIP deposit failed: ${error.message}`)
    }
  }
}
