import { BlockTag } from "@ethersproject/abstract-provider"
import { Web3Provider } from "@ethersproject/providers"
import {
  BitcoinClient,
  BitcoinTx,
  BitcoinTxHash,
  BitcoinUtxo,
  ChainIdentifier,
  CrossChainDepositor,
  Deposit,
  DepositRequest,
  ElectrumClient,
  ethereumAddressFromSigner,
  EthereumBridge,
  chainIdFromSigner,
  Hex,
  loadEthereumCoreContracts,
  TBTC as SDK,
  Chains,
  L2Chain,
} from "@keep-network/tbtc-v2.ts"
import {
  BigNumber,
  BigNumberish,
  Contract,
  providers,
  Signer,
  utils,
} from "ethers"
import { LogDescription } from "ethers/lib/utils"
import { ContractCall, IMulticall, Multicall } from "../multicall"
import { BitcoinConfig, BitcoinNetwork, EthereumConfig } from "../types"
import {
  AddressZero,
  fromSatoshiToTokenPrecision,
  getContract,
  getContractPastEvents,
  getSepoliaDevelopmentContracts,
  getSigner,
  getArtifact,
  isPayToScriptHashTypeAddress,
  isPublicKeyHashTypeAddress,
  isSameETHAddress,
  isValidBtcAddress,
  ZERO,
  ArtifactNameType,
  L2_RELAYER_BOT_WALLET,
} from "../utils"
import {
  isL1Network,
  isL2Network,
  getChainIdToNetworkName,
  getMainnetOrTestnetChainId,
} from "../../networks/utils"
import { SupportedChainIds } from "../../networks/enums/networks"
import { getThresholdLibProvider } from "../../utils/getThresholdLib"
import { getDefaultProviderChainId } from "../../utils/getEnvVariable"

export enum BridgeActivityStatus {
  PENDING = "PENDING",
  MINTED = "MINTED",
  ERROR = "ERROR",
  UNMINTED = "UNMINTED",
}

export type BridgeProcess = "mint" | "unmint"

export interface BridgeActivity {
  bridgeProcess: BridgeProcess
  status: BridgeActivityStatus
  txHash: string
  amount: string
  /**
   * Stores the deposit key for deposit and redemption key for redemption.
   */
  activityKey: string
  additionalData?: unknown
  blockNumber: number
}

export interface UnmintBridgeActivityAdditionalData {
  redeemerOutputScript: string
  walletPublicKeyHash: string
}

export interface RevealedDepositEvent {
  amount: string
  walletPublicKeyHash: string
  fundingTxHash: string
  fundingOutputIndex: string
  depositKey: string
  txHash: string
  blockNumber: number
}

export interface RevealedL2DepositEvent {
  depositKey: string
  l2DepositOwner: string
  l1Sender: string
  initialAmount: string
  tbtcAmount: string
  txHash: string
  blockNumber: number
}

export interface RedemptionRequestedEvent {
  amount: string
  walletPublicKeyHash: string
  redeemerOutputScript: string
  redeemer: string
  treasuryFee: string
  txMaxFee: string
  blockNumber: number
  txHash: string
}

type QueryEventFilter = { fromBlock?: BlockTag; toBlock?: BlockTag }

type RedemptionRequestedEventFilter = {
  walletPublicKeyHash?: string | string[]
  redeemer?: string | string[]
} & QueryEventFilter

export interface RedemptionRequest<
  NumberType extends BigNumberish = BigNumber
> {
  redeemer: string
  requestedAmount: NumberType
  treasuryFee: NumberType
  txMaxFee: NumberType
  requestedAt: number
  isPending: boolean
  isTimedOut: boolean
}

type RedemptionTimedOutEventFilter = {
  walletPublicKeyHash?: string | string[]
} & QueryEventFilter

interface RedemptionTimedOutEvent {
  walletPublicKeyHash: string
  redeemerOutputScript: string
  txHash: string
  blockNumber: number
}

type RedemptionsCompletedEventFilter = {
  walletPublicKeyHash: string
} & QueryEventFilter

interface RedemptionsCompletedEvent {
  walletPublicKeyHash: string
  redemptionBitcoinTxHash: string
  txHash: string
  blockNumber: number
}

type BitcoinTransactionHashByteOrder = "little-endian" | "big-endian"

type AmountToSatoshiResult = {
  /**
   * Amount of TBTC to be minted/unminted.
   */
  convertibleAmount: BigNumber
  /**
   * Not convertible remainder if amount is not divisible by satoshi multiplier.
   */
  remainder: BigNumber
  /**
   * Amount in satoshis - the balance to be transferred for the given
   * mint/unmint.
   */
  satoshis: BigNumber
}

export type DepositScriptParameters = {
  depositor: ChainIdentifier
  blindingFactor: string
  walletPublicKeyHash: string
  refundPublicKeyHash: string
  refundLocktime: string
  extraData?: string
}

class EmptySdkObjectError extends Error {
  constructor() {
    super("SDK object is not initialized.")
  }
}

class EmptyDepositObjectError extends Error {
  constructor() {
    super("Deposit object is not initiated.")
  }
}

export interface ITBTC {
  /**
   * Ethereum chain id specified in the ethereum config that we pass to the
   * threshold lib.
   * @returns {string | number}
   */
  readonly ethereumChainId: string | number
  /**
   * Bitcoin network specified in the bitcoin config that we pass to the
   * threshold lib.
   * @returns {BitcoinNetwork}
   */
  readonly bitcoinNetwork: BitcoinNetwork

  readonly bridgeContract: Contract | null

  readonly vaultContract: Contract | null

  readonly tokenContract: Contract | null

  readonly l1BitcoinDepositorContract: Contract | null

  readonly deposit: Deposit | undefined

  readonly isCrossChain: boolean

  /**
   * L2 tBTC token contract for cross-chain operations
   */
  readonly l2TbtcToken: any | null

  /**
   * Initializes cross-chain support for non-EVM chains like StarkNet
   * @param providerOrSigner Provider or signer for the cross-chain
   * @param account Account address (optional for non-EVM chains)
   * @param chainName The name of the chain (e.g., "StarkNet")
   */
  initiateCrossChain(
    providerOrSigner: any,
    account: string,
    chainName?: string
  ): Promise<void>

  /**
   * Initializes tbtc-v2 SDK
   * @param providerOrSigner Ethers instance of Provider (if wallet is not
   * connected) or Signer (if wallet is connected).
   * @param account Connected ethereum address (optional, needed only if user
   * connected his wallet).
   */
  initializeSdk(
    providerOrSigner: providers.Provider | Signer,
    account?: string
  ): Promise<void>
  /**
   * Initiates a Deposit object from bitcoin recovery address.
   * @param btcRecoveryAddress The bitcoin address in which the user will
   * receive the bitcoin back in case something goes wrong.
   * @returns Deposit object
   */
  initiateDeposit(btcRecoveryAddress: string): Promise<Deposit>

  /**
   * Initiates a Deposit object from bitcoin recovery address.
   * @param btcRecoveryAddress The bitcoin address in which the user will
   * receive the bitcoin back in case something goes wrong.
   * @returns Deposit object
   */
  initiateCrossChainDeposit(
    btcRecoveryAddress: string,
    chainId: number
  ): Promise<Deposit>

  /**
   * Removes the deposit data assigned to `this._deposit` property.
   */
  removeDepositData(): void

  /**
   * Initiates a deposit object from DepositScriptParameters object. Most of the
   * parameters are passed as strings and converted to hexes inside the
   * function.
   * @param depositScriptParameters DepositScriptParameters object that contains
   * all the data related to the deposit we want to re-initiate.
   * @returns Deposit object
   */
  initiateDepositFromDepositScriptParameters(
    depositScriptParameters: DepositScriptParameters
  ): Promise<Deposit>

  /**
   * Initiates a deposit object from DepositScriptParameters object. Most of the
   * parameters are passed as strings and converted to hexes inside the
   * function.
   * @param depositScriptParameters DepositScriptParameters object that contains
   * all the data related to the deposit we want to re-initiate.
   * @returns Deposit object
   */
  initiateCrossChainDepositFromScriptParameters(
    depositScriptParameters: DepositScriptParameters,
    chainId: number
  ): Promise<Deposit>

  /**
   * Calculates the deposit address from the deposit object stored in
   * this._deposit. Throws error if deposit object is not initiated.
   */
  calculateDepositAddress(): Promise<string>

  /**
   * Finds all unspent transaction outputs (UTXOs) for the initialized deposit,
   * that is stored in this._deposit property. The UTXOs are returned from
   * newest to oldest.
   * @returns List of Bitcoin UTXOs.
   */
  findAllUnspentTransactionOutputs(): Promise<BitcoinUtxo[]>

  /**
   * Gets estimated fees that will be payed during a reveal and estimated amount
   * of tBTC token that will be minted.
   * @param depositAmount Amount of BTC that will be revealed in Satoshi.
   * @returns Treasury fee, optimistic mint fee and estimated amount of tBTC
   * token that will be minted in ERC20 standard.
   */
  getEstimatedDepositFees(depositAmount: string): Promise<{
    treasuryFee: string
    optimisticMintFee: string
    amountToMint: string
    crossChainFee: string
  }>

  /**
   * Gets the deposit fees divisors and deposit max fee from the tBTC bridge
   * contract.
   * @returns depositTreasuryFeeDivisor, optimisticMintingFeeDivisor and
   * depositTxMaxFee of the tBTC bridge contract
   */
  getDepositFees(): Promise<{
    depositTreasuryFeeDivisor: BigNumber
    optimisticMintingFeeDivisor: BigNumber
    depositTxMaxFee: BigNumber
  }>

  /**
   * Reveals the given deposit to the on-chain Bridge contract.
   * @param utxo Bitcoin UTXO of the revealed deposit
   * @return Prefixed transaction hash of the reveal.
   */
  revealDeposit(utxo: BitcoinUtxo): Promise<string>

  /**
   * Gets a revealed deposit from the bridge.
   * @param utxo Deposit UTXO of the revealed deposit
   * @returns Revealed deposit data.
   */
  getRevealedDeposit(utxo: BitcoinUtxo): Promise<DepositRequest>

  /**
   * Gets the number of confirmations that a given transaction has accumulated
   * so far.
   * @param transactionHash Hash of the transaction as a string.
   * @returns The number of confirmations.
   */
  getTransactionConfirmations(transactionHash: string): Promise<number>

  /**
   * Gets the minimum number of confirmations needed for the minter to start the
   * minting process. The minimum number of confirmations is based on the amount
   * that was sent to the deposit address.
   * The rules are:
   * - If the amount is less than 0.1 BTC, it should have at least 1
   * confirmation.
   * - If the tx is less than 1 BTC, it should have at least 3 confirmations.
   * - Otherwise, we need to wait for 6 confirmations.
   * @param amount Amount that was sent to the deposit address (in satoshi)
   */
  minimumNumberOfConfirmationsNeeded(amount: BigNumberish): number

  /**
   * Returns the bridge transaction history by depositor in order from the
   * newest activities to the oldest.
   * @param account Ethereum address.
   * @returns Bridge transaction history @see {@link BridgeActivity}.
   */
  getBridgeActivity(account: string): Promise<BridgeActivity[]>

  /**
   * Builds the deposit key required to refer a revealed deposit.
   * @param depositTxHash The revealed deposit transaction's hash.
   * @param depositOutputIndex Index of the deposit transaction output that
   * funds the revealed deposit.
   * @param txHashByteOrder Determines the transaction hash byte order. Use
   * `little-endian` to build the deposit key from transaction hash in native
   * Bitcoin little-endian format- for example when using the `fundingTxHash`
   * parameter from the `DepositRevealed` event. Use `big-endian` to build the
   * deposit key from transaction hash in the same byte order as used by the
   * Bitcoin block explorers. The `little-endian` is used as default.
   * @returns Deposit key.
   */
  buildDepositKey(
    depositTxHash: string,
    depositOutputIndex: number,
    txHashByteOrder?: BitcoinTransactionHashByteOrder
  ): string

  findAllRevealedDeposits(depositor: string): Promise<RevealedDepositEvent[]>

  /**
   * Requests a redemption from the on-chain Bridge contract.
   * @param btcAddress The Bitcoin address that the redeemed funds will be
   * locked to.
   * @param amount The amount to be redeemed in tBTC token unit.
   * @returns Object containing transaction hash of the request redemption
   * transaction and `additionalParams` object, that contains Bitcoin public key
   * of the wallet asked to handle the redemption. The key is presented in the
   * compressed form (33 bytes long with 02 or 03 prefix). Both, transaction
   * hash and walletPublicKey are also prefixed with `0x`.
   */
  requestRedemption(
    btcAddress: string,
    amount: BigNumberish
  ): Promise<{
    hash: string
    additionalParams: {
      walletPublicKey: string
    }
  }>

  /**
   * Builds a redemption key required to refer a redemption request.
   * @param walletPublicKeyHash The wallet public key hash that identifies the
   *        pending redemption (along with the redeemer output script).
   * @param redeemerOutputScript The redeemer output script that identifies the
   *        pending redemption (along with the wallet public key hash).
   * @returns The redemption key.
   */
  buildRedemptionKey(
    walletPublicKeyHash: string,
    redeemerOutputScript: string
  ): string

  /**
   * Gets the full transaction object for given transaction hash.
   * @param transactionHash Hash of the transaction as a string.
   * @returns Bitcoin Transaction object.
   */
  getBitcoinTransaction(transactionHash: string): Promise<BitcoinTx>

  /**
   * Gets emitted `RedemptionRequested` events.
   * @param filter Filters to find emitted events by indexed params and block
   *               range.
   * @returns Redemption requests filtered by filter params.
   */
  getRedemptionRequestedEvents(
    filter: RedemptionRequestedEventFilter
  ): Promise<RedemptionRequestedEvent[]>

  /**
   * Gets the redemption details from the on-chain contract by the redemption
   * key. It also determines if redemption is pending or timed out.
   * @param redemptionKey The redemption key.
   * @returns Promise with the redemption details.
   */
  getRedemptionRequest(redemptionKey: string): Promise<RedemptionRequest>

  /**
   * Gets emitted `RedemptionTimedOut` events.
   * @param filter Filters to find emitted events by indexed params and block
   *               range.
   * @returns Redemption timed out events filtered by filter params.
   */
  getRedemptionTimedOutEvents(
    filter: RedemptionTimedOutEventFilter
  ): Promise<RedemptionTimedOutEvent[]>

  /**
   * Gets emitted `RedemptionsCompleted` events.
   * @param filter Filters to find emitted events by indexed params and block
   *               range.
   * @returns Redemptions completed events filtered by filter params.
   */
  getRedemptionsCompletedEvents(
    filter: RedemptionsCompletedEventFilter
  ): Promise<RedemptionsCompletedEvent[]>

  /**
   * Gets estimated fees that will be payed during a redemption and estimated
   * amount of BTC that will be redeemed.
   * @param redemptionAmount Amount of tbtc requested for redemption in ERC20
   * standard.
   * @returns Treasury fee (in token precision) and estimated amount of BTC that
   * will be redeemed (in satoshi).
   */
  getEstimatedRedemptionFees(redemptionAmount: string): Promise<{
    treasuryFee: string
    estimatedAmountToBeReceived: string
  }>
}

export class TBTC implements ITBTC {
  private _bridgeContract: Contract | null
  private _tbtcVaultContract: Contract | null
  private _tokenContract: Contract | null
  private _l1BitcoinDepositorContract: Contract | null = null
  private _l2TbtcToken: any | null = null
  private _multicall: IMulticall
  private _bitcoinClient: BitcoinClient
  private _ethereumConfig: EthereumConfig
  private _bitcoinConfig: BitcoinConfig
  private readonly _satoshiMultiplier = BigNumber.from(10).pow(10)
  private _redemptionTreasuryFeeDivisor: BigNumber | undefined

  /**
   * Holds the promise for the asynchronously initialized SDK instance.
   * This promise is set during the construction of the SDK class and is meant
   * to be resolved once the SDK is fully initialized. The promise is used to
   * ensure that the SDK is initialized only once and that all subsequent
   * retrievals of the SDK instance await this promise, thereby ensuring that
   * the SDK is ready for use before any operations are performed.
   *
   * The promise also facilitates updating the SDK instance dynamically: if a
   * new initialization is triggered (e.g., when a user logs in and provides a
   * new signer), it ensures that the new SDK object replaces any previously
   * pending SDK object, even if the original promise has not yet resolved.
   *
   * To retrieve the SDK object, use the `getSdk()` method. This method will
   * either return the already resolved SDK object or wait until the promise
   * resolves before returning the SDK.
   */

  private _sdkPromise: Promise<SDK | undefined>
  private _deposit: Deposit | undefined
  private _isCrossChain: boolean = false

  constructor(ethereumConfig: EthereumConfig, bitcoinConfig: BitcoinConfig) {
    if (!bitcoinConfig.client && !bitcoinConfig.credentials) {
      throw new Error(
        "Neither bitcoin client nor bitcoin credentials are specified"
      )
    }
    const {
      chainId,
      shouldUseTestnetDevelopmentContracts,
      providerOrSigner,
      account,
    } = ethereumConfig
    this._isCrossChain = isL2Network(chainId)

    // This ensures that, if the user is connected to an L2 network, the TBTC
    // contracts are connected to the corresponding Ethereum mainnet or testnet
    // based on which type of network the user is connected to.
    const mainnetOrTestnetEthereumChainId = getMainnetOrTestnetChainId(chainId)
    const defaultOrConnectedProvider = getThresholdLibProvider(
      mainnetOrTestnetEthereumChainId
    )

    const bridgeArtifact = getArtifact(
      "Bridge",
      mainnetOrTestnetEthereumChainId,
      shouldUseTestnetDevelopmentContracts
    )
    const tbtcVaultArtifact = getArtifact(
      "TBTCVault",
      mainnetOrTestnetEthereumChainId,
      shouldUseTestnetDevelopmentContracts
    )
    const tbtcTokenArtifact = getArtifact(
      "TBTC",
      mainnetOrTestnetEthereumChainId,
      shouldUseTestnetDevelopmentContracts
    )

    this._bridgeContract = bridgeArtifact
      ? getContract(
          bridgeArtifact.address,
          bridgeArtifact.abi,
          defaultOrConnectedProvider,
          account
        )
      : null
    this._tbtcVaultContract = tbtcVaultArtifact
      ? getContract(
          tbtcVaultArtifact.address,
          tbtcVaultArtifact.abi,
          defaultOrConnectedProvider,
          account
        )
      : null
    this._tokenContract = tbtcTokenArtifact
      ? getContract(
          tbtcTokenArtifact.address,
          tbtcTokenArtifact.abi,
          defaultOrConnectedProvider,
          account
        )
      : null
    this._multicall = new Multicall({
      ...ethereumConfig,
      providerOrSigner: defaultOrConnectedProvider,
      chainId: mainnetOrTestnetEthereumChainId,
    })

    if (this._isCrossChain) {
      const networkName = getChainIdToNetworkName(chainId)
      const l1BitcoinDepositorArtifact = getArtifact(
        `${networkName}L1BitcoinDepositor` as ArtifactNameType,
        mainnetOrTestnetEthereumChainId,
        shouldUseTestnetDevelopmentContracts
      )

      this._l1BitcoinDepositorContract = l1BitcoinDepositorArtifact
        ? getContract(
            l1BitcoinDepositorArtifact.address,
            l1BitcoinDepositorArtifact.abi,
            defaultOrConnectedProvider,
            account
          )
        : null
    }

    // @ts-ignore
    this._bitcoinClient =
      bitcoinConfig.client ??
      new ElectrumClient(
        bitcoinConfig.credentials!,
        bitcoinConfig.clientOptions
      )

    this._ethereumConfig = ethereumConfig
    this._bitcoinConfig = bitcoinConfig
    this._sdkPromise = new Promise((resolve) => resolve(undefined))

    this.initializeSdk(providerOrSigner, account)
  }

  async _initializeSdk(
    providerOrSigner: providers.Provider | Signer,
    account?: string
  ): Promise<SDK> {
    const isMainnet = this.bitcoinNetwork === BitcoinNetwork.Mainnet
    const defaultProvider = isMainnet
      ? getThresholdLibProvider(SupportedChainIds.Ethereum)
      : getThresholdLibProvider(SupportedChainIds.Sepolia)

    const signer =
      !!account && providerOrSigner instanceof Web3Provider
        ? getSigner(providerOrSigner as Web3Provider, account)
        : providerOrSigner

    const connectedChainId = await chainIdFromSigner(signer)

    const initializerProviderOrSigner = isL1Network(connectedChainId)
      ? signer
      : defaultProvider

    const { shouldUseTestnetDevelopmentContracts } = this._ethereumConfig
    const { client: clientFromConfig } = this._bitcoinConfig

    // For both of these cases we will use SDK.initializeCustom() method
    if (clientFromConfig || shouldUseTestnetDevelopmentContracts) {
      const depositorAddress = await ethereumAddressFromSigner(signer)
      const tbtcContracts = shouldUseTestnetDevelopmentContracts
        ? getSepoliaDevelopmentContracts(signer)
        : await loadEthereumCoreContracts(
            defaultProvider,
            getDefaultProviderChainId().valueOf().toString() as Chains.Ethereum
          )

      const sdk = await SDK.initializeCustom(tbtcContracts, this._bitcoinClient)

      depositorAddress && sdk.deposits.setDefaultDepositor(depositorAddress)

      return sdk
    }

    const initializeFunction = isMainnet
      ? SDK.initializeMainnet
      : SDK.initializeSepolia

    // We need to use a mainnet default provider to initialize the SDK
    const sdk = await initializeFunction(
      initializerProviderOrSigner,
      isL2Network(connectedChainId)
    )

    return sdk
  }

  async initializeSdk(
    providerOrSigner: providers.Provider | Signer,
    account?: string | undefined
  ): Promise<void> {
    try {
      this._sdkPromise = this._initializeSdk(providerOrSigner, account)

      if (this.isCrossChain) {
        await this.initiateCrossChain(
          providerOrSigner as Web3Provider,
          account as string
        )
      }
    } catch (err) {
      throw new Error(`Something went wrong when initializing tbtc sdk: ${err}`)
    }
  }

  get deposit(): Deposit | undefined {
    return this._deposit
  }

  get ethereumChainId(): string | number {
    return this._ethereumConfig.chainId
  }

  get bitcoinNetwork(): BitcoinNetwork {
    return this._bitcoinConfig.network
  }

  get bridgeContract() {
    return this._bridgeContract
  }

  get vaultContract() {
    return this._tbtcVaultContract
  }

  get tokenContract() {
    return this._tokenContract
  }

  get l1BitcoinDepositorContract() {
    return this._l1BitcoinDepositorContract
  }

  get isCrossChain(): boolean {
    return this._isCrossChain
  }

  get l2TbtcToken() {
    return this._l2TbtcToken
  }

  private _getSdk = async (): Promise<SDK> => {
    const sdk = await this._sdkPromise
    if (!sdk) throw new EmptySdkObjectError()

    return sdk
  }

  initiateCrossChain = async (
    providerOrSigner: Web3Provider | any, // Support non-EVM providers
    account: string,
    chainName?: string
  ): Promise<void> => {
    const sdk = await this._getSdk()

    // For Starknet, use single-parameter initialization
    if (chainName === "StarkNet") {
      // Validate provider
      if (!providerOrSigner) {
        throw new Error("Provider is required for StarkNet")
      }

      // Check if provider has account information
      const hasAddress =
        "address" in providerOrSigner &&
        typeof providerOrSigner.address === "string"
      const hasAccount =
        "account" in providerOrSigner && providerOrSigner.account?.address

      if (!hasAddress && !hasAccount) {
        throw new Error(
          "StarkNet provider must be an Account object or Provider with connected account."
        )
      }

      // Single-parameter initialization for StarkNet
      await sdk.initializeCrossChain("StarkNet" as L2Chain, providerOrSigner)

      // Get the L2 tBTC token instance from SDK
      const crossChainContracts = sdk.crossChainContracts("StarkNet" as L2Chain)
      if (crossChainContracts) {
        this._l2TbtcToken = crossChainContracts.l2TbtcToken
      }
    } else {
      // Standard L2 initialization for EVM chains
      const signer = getSigner(providerOrSigner as Web3Provider, account)
      const connectedChainId = await chainIdFromSigner(signer)
      const l2NetworkName = getChainIdToNetworkName(connectedChainId)
      await sdk.initializeCrossChain(l2NetworkName as L2Chain, signer)
    }
  }

  initiateDeposit = async (btcRecoveryAddress: string): Promise<Deposit> => {
    const sdk = await this._getSdk()
    this._deposit = await sdk.deposits.initiateDeposit(btcRecoveryAddress)
    return this._deposit
  }

  initiateCrossChainDeposit = async (
    btcRecoveryAddress: string,
    chainId: number
  ): Promise<Deposit> => {
    if (!this._isCrossChain) {
      throw new Error("Unsupported chain ID")
    }

    const sdk = await this._getSdk()
    const l2NetworkName = getChainIdToNetworkName(chainId)
    this._deposit = await sdk.deposits.initiateCrossChainDeposit(
      btcRecoveryAddress,
      l2NetworkName as Exclude<keyof typeof Chains, "Ethereum">
    )
    return this._deposit
  }

  removeDepositData = (): void => {
    this._deposit = undefined
  }

  initiateDepositFromDepositScriptParameters = async (
    depositScriptParameters: DepositScriptParameters
  ): Promise<Deposit> => {
    const sdk = await this._getSdk()
    const {
      depositor,
      blindingFactor,
      walletPublicKeyHash,
      refundPublicKeyHash,
      refundLocktime,
    } = depositScriptParameters

    const depositReceipt = {
      depositor,
      blindingFactor: Hex.from(blindingFactor),
      walletPublicKeyHash: Hex.from(walletPublicKeyHash),
      refundLocktime: Hex.from(refundLocktime),
      refundPublicKeyHash: Hex.from(refundPublicKeyHash),
    }

    this._deposit = await Deposit.fromReceipt(
      depositReceipt,
      sdk.tbtcContracts,
      sdk.bitcoinClient
    )
    return this._deposit
  }

  initiateCrossChainDepositFromScriptParameters = async (
    depositScriptParameters: DepositScriptParameters,
    chainId: number
  ): Promise<Deposit> => {
    if (!this._isCrossChain) {
      throw new Error("Unsupported chain ID")
    }
    const l2NetworkName = getChainIdToNetworkName(chainId)
    const sdk = await this._getSdk()

    const {
      depositor,
      blindingFactor,
      walletPublicKeyHash,
      refundPublicKeyHash,
      refundLocktime,
      extraData,
    } = depositScriptParameters

    if (!extraData) {
      throw new Error("Extra data is required for cross-chain deposit")
    }

    const depositReceipt = {
      depositor,
      blindingFactor: Hex.from(blindingFactor),
      walletPublicKeyHash: Hex.from(walletPublicKeyHash),
      refundLocktime: Hex.from(refundLocktime),
      refundPublicKeyHash: Hex.from(refundPublicKeyHash),
      extraData: Hex.from(extraData),
    }

    await this.initiateCrossChain(
      this._ethereumConfig.providerOrSigner as Web3Provider,
      this._ethereumConfig.account as string
    )

    const crossChainContracts = sdk.crossChainContracts(
      l2NetworkName as Exclude<keyof typeof Chains, "Ethereum">
    )

    if (!crossChainContracts) {
      throw new Error("Cross-chain contracts are not initialized")
    }
    const depositorProxy = new CrossChainDepositor(crossChainContracts)

    this._deposit = await Deposit.fromReceipt(
      depositReceipt,
      sdk.tbtcContracts,
      sdk.bitcoinClient,
      depositorProxy
    )

    return this._deposit
  }

  calculateDepositAddress = async (): Promise<string> => {
    if (!this._deposit) throw new EmptyDepositObjectError()
    return await this._deposit.getBitcoinAddress()
  }

  findAllUnspentTransactionOutputs = async (): Promise<BitcoinUtxo[]> => {
    if (!this._deposit) throw new EmptyDepositObjectError()
    const fundingDetected = await this._deposit.detectFunding()
    return fundingDetected || []
  }

  getEstimatedDepositFees = async (depositAmount: string) => {
    const {
      depositTreasuryFeeDivisor,
      optimisticMintingFeeDivisor,
      depositTxMaxFee,
    } = await this.getDepositFees()

    const crossChainTxFee = this.isCrossChain
      ? BigNumber.from(depositTxMaxFee)
      : ZERO

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/bridge/Deposit.sol#L258-L260
    const treasuryFee = BigNumber.from(depositTreasuryFeeDivisor).gt(0)
      ? BigNumber.from(depositAmount).div(depositTreasuryFeeDivisor)
      : ZERO

    const { amountToMint, optimisticMintFee } =
      this._calculateOptimisticMintingAmountAndFee(
        BigNumber.from(depositAmount),
        treasuryFee,
        optimisticMintingFeeDivisor,
        depositTxMaxFee
      )

    return {
      treasuryFee: treasuryFee.mul(this._satoshiMultiplier).toString(),
      optimisticMintFee: optimisticMintFee.toString(),
      amountToMint: amountToMint.toString(),
      crossChainFee: crossChainTxFee.mul(this._satoshiMultiplier).toString(),
    }
  }

  getDepositFees = async (): Promise<{
    depositTreasuryFeeDivisor: BigNumber
    optimisticMintingFeeDivisor: BigNumber
    depositTxMaxFee: BigNumber
  }> => {
    const calls: ContractCall[] = [
      {
        interface: this._bridgeContract!.interface,
        address: this._bridgeContract!.address,
        method: "depositParameters",
        args: [],
      },
      {
        interface: this._tbtcVaultContract!.interface,
        address: this._tbtcVaultContract!.address,
        method: "optimisticMintingFeeDivisor",
        args: [],
      },
    ]

    const [depositParams, _optimisticMintingFeeDivisor] =
      await this._multicall!.aggregate(calls)

    const depositTreasuryFeeDivisor = BigNumber.from(
      depositParams.depositTreasuryFeeDivisor
    )
    const depositTxMaxFee = BigNumber.from(depositParams.depositTxMaxFee)
    const optimisticMintingFeeDivisor = BigNumber.from(
      _optimisticMintingFeeDivisor[0]
    )

    return {
      depositTreasuryFeeDivisor,
      optimisticMintingFeeDivisor,
      depositTxMaxFee,
    }
  }

  private _calculateOptimisticMintingAmountAndFee(
    depositAmount: BigNumber,
    treasuryFee: BigNumber,
    optimisticMintingFeeDivisor: BigNumber,
    depositTxMaxFee: BigNumber
  ): {
    optimisticMintFee: BigNumber
    amountToMint: BigNumber
  } {
    const amountToMintAfterTreasuryFee = depositAmount
      .sub(treasuryFee)
      .mul(this._satoshiMultiplier)

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/vault/TBTCOptimisticMinting.sol#L328-L336
    const optimisticMintFee = BigNumber.from(optimisticMintingFeeDivisor).gt(0)
      ? amountToMintAfterTreasuryFee.div(optimisticMintingFeeDivisor)
      : ZERO

    const finalAmountToMint =
      amountToMintAfterTreasuryFee.sub(optimisticMintFee)

    return {
      optimisticMintFee: optimisticMintFee,
      amountToMint: finalAmountToMint,
    }
  }

  revealDeposit = async (utxo: BitcoinUtxo): Promise<string> => {
    const { value, ...transactionOutpoint } = utxo
    if (!this._deposit) throw new EmptyDepositObjectError()
    const chainHash = await this._deposit.initiateMinting(transactionOutpoint)
    this.removeDepositData()

    return chainHash.toPrefixedString()
  }

  getRevealedDeposit = async (utxo: BitcoinUtxo): Promise<DepositRequest> => {
    const sdk = await this._getSdk()
    const deposit = await sdk.tbtcContracts.bridge.deposits(
      utxo.transactionHash,
      utxo.outputIndex
    )
    if (!deposit) {
      throw new Error("Deposit not found!")
    }
    return deposit
  }

  getTransactionConfirmations = async (
    transactionHash: string
  ): Promise<number> => {
    const bitcoinTransactionHash = BitcoinTxHash.from(transactionHash)
    return this._bitcoinClient.getTransactionConfirmations(
      bitcoinTransactionHash
    )
  }

  minimumNumberOfConfirmationsNeeded = (amount: BigNumberish): number => {
    const amountInBN = BigNumber.from(amount)
    if (amountInBN.lt(10000000) /* 0.1 BTC */) {
      return 1
    } else if (amountInBN.lt(100000000) /* 1 BTC */) {
      return 3
    }
    return 6
  }

  getBridgeActivity = async (account: string): Promise<BridgeActivity[]> => {
    const depositActivities = await this._findAllDepositActivities(account)

    const redemptionActivities: BridgeActivity[] =
      await this._findRedemptionActivities(account)

    return depositActivities
      .concat(redemptionActivities)
      .sort((a, b) => b.blockNumber - a.blockNumber)
  }

  private _findAllDepositActivities = async (
    depositor: string
  ): Promise<BridgeActivity[]> => {
    const l1DepositActivities = await this._findL1DepositActivities(depositor)

    let l2DepositActivities: BridgeActivity[] = []
    if (this.isCrossChain) {
      l2DepositActivities = await this._findL2DepositActivities(depositor)
    }

    const depositActivities = [...l1DepositActivities, ...l2DepositActivities]
    depositActivities.sort((a, b) => a.blockNumber - b.blockNumber)

    return depositActivities
  }

  findAllRevealedDeposits = async (
    depositor: string
  ): Promise<RevealedDepositEvent[]> => {
    const chainId = getMainnetOrTestnetChainId(this.ethereumChainId)

    const bridgeArtifact = getArtifact(
      "Bridge",
      chainId,
      this._ethereumConfig.shouldUseTestnetDevelopmentContracts
    )

    if (!bridgeArtifact || !this._bridgeContract) {
      console.warn("Bridge contract is not initialized.")
      return []
    }

    const deposits = await getContractPastEvents(this._bridgeContract, {
      fromBlock: bridgeArtifact.receipt.blockNumber,
      filterParams: [null, null, depositor],
      eventName: "DepositRevealed",
    })

    return deposits
      .map((deposit) => {
        const fundingTxHash = deposit.args?.fundingTxHash
        const fundingOutputIndex = deposit.args?.fundingOutputIndex

        const depositKey = this.buildDepositKey(
          fundingTxHash,
          fundingOutputIndex
        )

        return {
          amount: deposit.args?.amount.toString(),
          walletPublicKeyHash: deposit.args?.walletPubKeyHash,
          fundingTxHash,
          fundingOutputIndex,
          depositKey,
          txHash: deposit.transactionHash,
          blockNumber: deposit.blockNumber,
        }
      })
      .reverse()
  }

  private _findL1DepositActivities = async (
    depositor: string
  ): Promise<BridgeActivity[]> => {
    const revealedDeposits = await this.findAllRevealedDeposits(depositor)
    const depositKeys = revealedDeposits.map((_) => _.depositKey)

    const estimatedAmountToMintByDepositKey =
      await this._calculateEstimatedAmountToMintForRevealedDeposits(depositKeys)

    const mintedDepositEvents = await this._findAllMintedDeposits(
      depositor,
      depositKeys
    )

    const mintedDeposits = new Map(
      mintedDepositEvents.map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )

    const cancelledDeposits = new Map(
      (await this._findAllCancelledDeposits(depositKeys)).map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )

    const mintedAmountByTxHash = new Map(
      await Promise.all(
        Array.from(mintedDeposits.values()).map((txHash) =>
          this._getMintedAmountFromTxHash(txHash, depositor)
        )
      )
    )

    return revealedDeposits.map((deposit) => {
      const { depositKey, txHash: depositTxHash, blockNumber } = deposit
      let status = BridgeActivityStatus.PENDING
      let txHash = depositTxHash
      let amount = estimatedAmountToMintByDepositKey.get(depositKey) ?? ZERO

      if (mintedDeposits.has(depositKey)) {
        status = BridgeActivityStatus.MINTED
        txHash = mintedDeposits.get(depositKey)!
        amount = mintedAmountByTxHash.get(txHash)!
      } else if (cancelledDeposits.has(depositKey)) {
        status = BridgeActivityStatus.ERROR
        txHash = cancelledDeposits.get(depositKey)!
      }

      return {
        amount: amount.toString(),
        txHash,
        status,
        activityKey: depositKey,
        bridgeProcess: "mint",
        blockNumber,
      } as BridgeActivity
    })
  }

  private _findL2DepositActivities = async (
    depositor: string
  ): Promise<BridgeActivity[]> => {
    const l2DepositActivities: BridgeActivity[] = []

    const l2AllRevealedDeposits = await this.findAllRevealedDeposits(
      this.l1BitcoinDepositorContract?.address as string
    )
    const l2DepositKeys = l2AllRevealedDeposits.map((_) => _.depositKey)

    const estimatedAmountToMintByDepositKey =
      await this._calculateEstimatedAmountToMintForRevealedDeposits(
        l2DepositKeys
      )

    const l2InitializedDepositsEvents =
      await this._findAllInitializedL2Deposits(depositor)
    const l2FinalizedDepositsEvents = await this._findAllFinalizedL2Deposits(
      depositor
    )

    const l2InitializedDeposits = new Map(
      l2InitializedDepositsEvents.map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )

    const l2FinalizedDeposits = new Map(
      l2FinalizedDepositsEvents.map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )

    const l2FinalizedDepositAmountByTxHash = new Map<string, BigNumber>(
      l2FinalizedDepositsEvents.map((event) => [
        event.transactionHash,
        event.args?.tbtcAmount as BigNumber,
      ])
    )

    for (const l2Deposit of l2AllRevealedDeposits) {
      const { depositKey, txHash: depositTxHash, blockNumber } = l2Deposit

      if (!l2InitializedDeposits.has(depositKey)) continue

      let status = BridgeActivityStatus.PENDING
      let txHash = depositTxHash
      let amount = estimatedAmountToMintByDepositKey.get(depositKey) ?? ZERO

      if (l2FinalizedDeposits.has(depositKey)) {
        status = BridgeActivityStatus.MINTED
        txHash = l2FinalizedDeposits.get(depositKey)!
        amount = l2FinalizedDepositAmountByTxHash.get(txHash)!
      }

      l2DepositActivities.push({
        amount: amount.toString(),
        txHash,
        status,
        activityKey: depositKey,
        bridgeProcess: "mint",
        blockNumber,
      } as BridgeActivity)
    }

    return l2DepositActivities
  }

  private _findAllFinalizedL2Deposits = async (
    depositor: string
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    const l2DepositOwner = depositor
    const l1Sender = L2_RELAYER_BOT_WALLET

    const l1BitcoinDepositorArtifact = getArtifact(
      `${getChainIdToNetworkName(
        this.ethereumChainId
      )}L1BitcoinDepositor` as ArtifactNameType,
      getMainnetOrTestnetChainId(this.ethereumChainId)
    )

    if (!l1BitcoinDepositorArtifact || !this._l1BitcoinDepositorContract) {
      console.warn("L1 Bitcoin Depositor contract is not initialized.")
      return []
    }

    return await getContractPastEvents(this._l1BitcoinDepositorContract, {
      fromBlock: l1BitcoinDepositorArtifact.receipt.blockNumber,
      filterParams: [null, l2DepositOwner, l1Sender],
      eventName: "DepositFinalized",
    })
  }

  private _findAllInitializedL2Deposits = async (
    depositor: string
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    const l2DepositOwner = depositor
    const l1Sender = L2_RELAYER_BOT_WALLET

    const l1BitcoinDepositorArtifact = getArtifact(
      `${getChainIdToNetworkName(
        this.ethereumChainId
      )}L1BitcoinDepositor` as ArtifactNameType,
      getMainnetOrTestnetChainId(this.ethereumChainId)
    )

    if (!l1BitcoinDepositorArtifact || !this._l1BitcoinDepositorContract) {
      console.warn("L1 Bitcoin Depositor contract is not initialized.")
      return []
    }

    return await getContractPastEvents(this._l1BitcoinDepositorContract!, {
      fromBlock: l1BitcoinDepositorArtifact.receipt.blockNumber,
      filterParams: [null, l2DepositOwner, l1Sender],
      eventName: "DepositInitialized",
    })
  }

  private _calculateEstimatedAmountToMintForRevealedDeposits = async (
    depositKeys: string[]
  ): Promise<Map<string, BigNumber>> => {
    const { optimisticMintingFeeDivisor, depositTxMaxFee } =
      await this.getDepositFees()

    const deposits = (
      await this._multicall.aggregate(
        depositKeys.map((depositKey) => ({
          interface: this.bridgeContract!.interface,
          address: this.bridgeContract!.address,
          method: "deposits",
          args: [depositKey],
        }))
      )
    ).map((deposit) => deposit[0]) as {
      amount: BigNumber
      treasuryFee: BigNumber
    }[]

    return new Map(
      depositKeys.map((depositKey, index) => {
        const deposit = deposits[index]
        return [
          depositKey,
          this._calculateOptimisticMintingAmountAndFee(
            deposit.amount,
            deposit.treasuryFee,
            optimisticMintingFeeDivisor,
            depositTxMaxFee
          ).amountToMint,
        ]
      })
    )
  }

  private _getMintedAmountFromTxHash = async (
    optimisticMintingFinalizedTxHash: string,
    depositor: string
  ): Promise<[string, BigNumber]> => {
    const receipt = await this.tokenContract!.provider.getTransactionReceipt(
      optimisticMintingFinalizedTxHash
    )

    // There is only one transfer to depositor account.
    const transferEvent = receipt.logs
      .filter((log) =>
        isSameETHAddress(log.address, this._tokenContract!.address)
      )
      .map((log) => this._tokenContract!.interface.parseLog(log))
      .filter((log) => log.name === "Transfer")
      .find((log) => isSameETHAddress(log.args.to, depositor))

    return [
      optimisticMintingFinalizedTxHash,
      BigNumber.from(transferEvent?.args?.value ?? ZERO),
    ]
  }

  private _findAllMintedDeposits = async (
    depositor: string,
    depositKeys: string[] = []
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    const chainId = getMainnetOrTestnetChainId(this.ethereumChainId)

    const tbtcVaultArtifact = getArtifact(
      "TBTCVault",
      chainId,
      this._ethereumConfig.shouldUseTestnetDevelopmentContracts
    )

    if (!tbtcVaultArtifact || !this._tbtcVaultContract) {
      console.warn("TBTC vault contract is not initialized.")
      return []
    }

    return await getContractPastEvents(this._tbtcVaultContract, {
      fromBlock: tbtcVaultArtifact.receipt.blockNumber,
      filterParams: [null, depositKeys, depositor],
      eventName: "OptimisticMintingFinalized",
    })
  }

  private _findAllCancelledDeposits = async (
    depositKeys: string[]
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    const chainId = getMainnetOrTestnetChainId(this.ethereumChainId)

    const tbtcVaultArtifact = getArtifact(
      "TBTCVault",
      chainId,
      this._ethereumConfig.shouldUseTestnetDevelopmentContracts
    )

    if (!tbtcVaultArtifact || !this._tbtcVaultContract) {
      console.warn("TBTC vault contract is not initialized.")
      return []
    }

    return getContractPastEvents(this._tbtcVaultContract, {
      fromBlock: tbtcVaultArtifact.receipt.blockNumber,
      filterParams: [null, depositKeys],
      eventName: "OptimisticMintingCancelled",
    })
  }

  private _findRedemptionActivities = async (
    redeemer: string
  ): Promise<BridgeActivity[]> => {
    const requestedRedemptions = await this.getRedemptionRequestedEvents({
      redeemer,
    })

    const redemptions: BridgeActivity[] = []

    for (const event of requestedRedemptions) {
      const { timestamp: eventTimestamp } =
        await this._bridgeContract!.provider.getBlock(event.blockNumber)
      const redemptionKey = this.buildRedemptionKey(
        event.walletPublicKeyHash,
        event.redeemerOutputScript
      )

      const redemptionDetails = await this.getRedemptionRequest(redemptionKey)
      // We need to make sure this is the same redemption request. Let's
      // consider this case:
      // - redemption X requested,
      // - redemption X was handled successfully and the redemption X was
      //   removed from `pendingRedemptions` map,
      // - the same wallet is still in `live` state and can handle redemption
      //   request with the same `walletPubKeyHash` and `redeemerOutputScript`
      //   pair(the same redemption request key),
      // - the redemption request X exists in the `pendingRedemptions` map.
      //
      // In this case we want to mark the first redemption as completed and the
      // second one as pending. If we do not compare the timestamps both requests
      // will be considered as pending.
      const isTheSameRedemption =
        eventTimestamp === redemptionDetails.requestedAt

      const isTimedOut = isTheSameRedemption && redemptionDetails.isTimedOut
      const requestedAt = isTheSameRedemption
        ? redemptionDetails.requestedAt
        : 0

      let status = BridgeActivityStatus.PENDING
      if (isTimedOut) status = BridgeActivityStatus.ERROR
      if (requestedAt === 0) status = BridgeActivityStatus.UNMINTED

      redemptions.push({
        status,
        txHash: event.txHash,
        // We need to get an amount from an event because if the redemption was
        // handled sucesfully the `getRedemptionRequest` returns `0`. The
        // `amount` in event is in satoshi, so here we convert to token
        // precision.
        amount: fromSatoshiToTokenPrecision(event.amount).toString(),
        activityKey: redemptionKey,
        bridgeProcess: "unmint",
        blockNumber: event.blockNumber,
        additionalData: {
          redeemerOutputScript: event.redeemerOutputScript,
          walletPublicKeyHash: event.walletPublicKeyHash,
        } as UnmintBridgeActivityAdditionalData,
      })
    }

    return redemptions
  }

  buildDepositKey = (
    depositTxHash: string,
    depositOutputIndex: number,
    txHashByteOrder: BitcoinTransactionHashByteOrder = "little-endian"
  ): string => {
    const _txHash = BitcoinTxHash.from(depositTxHash)

    return EthereumBridge.buildDepositKey(
      txHashByteOrder === "little-endian" ? _txHash.reverse() : _txHash,
      depositOutputIndex
    )
  }

  requestRedemption = async (
    btcAddress: string,
    amount: BigNumberish
  ): Promise<{
    hash: string
    additionalParams: {
      walletPublicKey: string
    }
  }> => {
    const sdk = await this._getSdk()

    if (this._isValidBitcoinAddressForRedemption(btcAddress)) {
      throw new Error(
        "Unsupported BTC address! Supported type addresses are: P2PKH, P2WPKH, P2SH, P2WSH."
      )
    }

    const { targetChainTxHash, walletPublicKey } =
      await sdk.redemptions.requestRedemption(
        btcAddress,
        BigNumber.from(amount)
      )

    return {
      hash: targetChainTxHash.toPrefixedString(),
      additionalParams: {
        walletPublicKey: walletPublicKey.toString(),
      },
    }
  }

  private _isValidBitcoinAddressForRedemption = (
    btcAddress: string
  ): boolean => {
    const network = this.bitcoinNetwork
    return (
      !isValidBtcAddress(btcAddress, network) ||
      (!isPublicKeyHashTypeAddress(btcAddress, network) &&
        !isPayToScriptHashTypeAddress(btcAddress, network))
    )
  }

  /**
   * Returns the amount of tBTC to be minted/unminted, the remainder, and the
   * balance to be transferred for the given mint/unmint. Note that if the
   * `amount` is not divisible by SATOSHI_MULTIPLIER, the remainder is left on
   * the caller's account when minting or unminting.
   * @param {BigNumberish} amount Amount of tBTC to be converted.
   * @return {AmountToSatoshiResult} The object that represents convertible
   *         amount, remainder and amount in satoshi.
   */
  private _amountToSatoshi = (amount: BigNumberish): AmountToSatoshiResult => {
    const _amount = BigNumber.from(amount)

    const remainder = _amount.mod(this._satoshiMultiplier)
    const convertibleAmount = _amount.sub(remainder)
    const satoshis = convertibleAmount.div(this._satoshiMultiplier)

    return {
      remainder,
      convertibleAmount,
      satoshis,
    }
  }

  buildRedemptionKey = (
    walletPublicKeyHash: string,
    redeemerOutputScript: string
  ) => {
    // The `buildRedemptionKey` static method from `EthereumBridge` prefixes the
    // `walletPublicKeyHash` with `0x` and it's length. It also prefixes
    // walletPublicKeyHash. In our use cases of this method our values are
    // already prefixed (for example in the deposit details link), so we are
    // just extracting the needed code from the lib here. We might want to
    // refactor that in the future.
    return utils.solidityKeccak256(
      ["bytes32", "bytes20"],
      [
        utils.solidityKeccak256(["bytes"], [redeemerOutputScript]),
        walletPublicKeyHash,
      ]
    )
  }

  getBitcoinTransaction = async (
    transactionHash: string
  ): Promise<BitcoinTx> => {
    return this._bitcoinClient.getTransaction(Hex.from(transactionHash))
  }

  getRedemptionRequestedEvents = async (
    filter: RedemptionRequestedEventFilter
  ): Promise<RedemptionRequestedEvent[]> => {
    const { walletPublicKeyHash, redeemer, fromBlock, toBlock } = filter

    // TODO: Use this sinppet to fetch events once we provide a fix in the `ethers.js` lib.
    // const events = await getContractPastEvents(this.bridgeContract, {
    //   eventName: "RedemptionRequested",
    //   filterParams: [walletPublicKeyHash, null, redeemer],
    //   fromBlock,
    //   toBlock,
    // })

    // This is a workaround to get the `RedemptionRequested` events by
    // `walletPublicKeyHash` param. The `ethers.js` lib encodes the `bytesX`
    // param in the wrong way. It uses the left-padded rule but based on the
    // Solidity docs it should be a sequence of bytes in X padded with trailing
    // zero-bytes to a length of 32 bytes(right-padded). See
    // https://docs.soliditylang.org/en/v0.8.17/abi-spec.html#formal-specification-of-the-encoding
    // Consider this wallet public key hash
    // `0x03B74D6893AD46DFDD01B9E0E3B3385F4FCE2D1E`:
    // - `ethers.js` returns
    //   `0x00000000000000000000000003b74d6893ad46dfdd01b9e0e3b3385f4fce2d1e`
    // - should be:
    //   `0x03b74d6893ad46dfdd01b9e0e3b3385f4fce2d1e000000000000000000000000`

    const encodeAddress = (address: string) =>
      utils.hexZeroPad(utils.hexlify(address), 32)

    const filterTopics = [
      utils.id(
        "RedemptionRequested(bytes20,bytes,address,uint64,uint64,uint64)"
      ),
      this._encodeWalletPublicKeyHash(walletPublicKeyHash),
      Array.isArray(redeemer)
        ? redeemer.map(encodeAddress)
        : encodeAddress(redeemer ?? AddressZero),
    ]

    const logs = await this.bridgeContract!.queryFilter(
      {
        address: this.bridgeContract!.address,
        // @ts-ignore
        topics: filterTopics,
      },
      fromBlock,
      toBlock
    )

    return logs
      .map((log) => ({
        ...this.bridgeContract!.interface.parseLog(log),
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
      }))
      .map(this._parseRedemptionRequestedEvent)
  }

  private _encodeWalletPublicKeyHash = (
    walletPublicKeyHash?: string | string[]
  ): string | undefined | string[] => {
    const encodeWalletPublicKeyHash = (hash: string) =>
      utils.defaultAbiCoder.encode(["bytes20"], [hash])

    return Array.isArray(walletPublicKeyHash)
      ? walletPublicKeyHash.map(encodeWalletPublicKeyHash)
      : walletPublicKeyHash
      ? encodeWalletPublicKeyHash(walletPublicKeyHash)
      : undefined
  }

  _parseRedemptionRequestedEvent = (
    event: LogDescription & {
      blockNumber: number
      transactionHash: string
    }
  ): RedemptionRequestedEvent => {
    return {
      amount: event.args?.requestedAmount.toString(),
      walletPublicKeyHash: event.args?.walletPubKeyHash.toString(),
      redeemerOutputScript: event.args?.redeemerOutputScript.toString(),
      redeemer: event.args?.redeemer.toString(),
      treasuryFee: event.args?.treasuryFee.toString(),
      txMaxFee: event.args?.txMaxFee.toString(),
      blockNumber: event.blockNumber,
      txHash: event.transactionHash,
    }
  }

  getRedemptionRequest = async (
    redemptionKey: string
  ): Promise<RedemptionRequest> => {
    const [[pending], [timedOut]] = await this._multicall!.aggregate([
      {
        interface: this._bridgeContract!.interface,
        address: this._bridgeContract!.address,
        method: "pendingRedemptions",
        args: [redemptionKey],
      },
      {
        interface: this._bridgeContract!.interface,
        address: this._bridgeContract!.address,
        method: "timedOutRedemptions",
        args: [redemptionKey],
      },
    ])

    const isPending = pending.requestedAt !== 0
    const isTimedOut = !isPending ? timedOut.requestedAt !== 0 : false

    let redemptionData: Omit<RedemptionRequest, "isPending" | "isTimedOut">

    if (isPending) {
      redemptionData = pending
    } else if (isTimedOut) {
      redemptionData = timedOut
    } else {
      redemptionData = {
        redeemer: AddressZero,
        requestedAmount: ZERO,
        treasuryFee: ZERO,
        txMaxFee: ZERO,
        requestedAt: 0,
      }
    }

    return {
      ...redemptionData,
      redeemer: redemptionData.redeemer.toString(),
      isPending,
      isTimedOut,
    }
  }

  getRedemptionTimedOutEvents = async (
    filter: RedemptionTimedOutEventFilter
  ): Promise<RedemptionTimedOutEvent[]> => {
    const { walletPublicKeyHash, fromBlock, toBlock } = filter

    // TODO: Use `getContractPastEvents` to fetch events once we provide a fix
    // in the `ethers.js` lib. This is a workaround to get the
    // `RedemptionTimedOut` events by `walletPublicKeyHash` param. The
    // `ethers.js` lib encodes the `bytesX` param in the wrong way.
    const filterTopics = [
      utils.id("RedemptionTimedOut(bytes20,bytes)"),
      this._encodeWalletPublicKeyHash(walletPublicKeyHash),
    ]

    const logs = await this.bridgeContract!.queryFilter(
      {
        address: this.bridgeContract!.address,
        // @ts-ignore
        topics: filterTopics,
      },
      fromBlock,
      toBlock
    )

    return logs.map((log) => ({
      walletPublicKeyHash: log.args?.walletPubKeyHash.toString(),
      redeemerOutputScript: log.args?.redeemerOutputScript.toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }))
  }

  getRedemptionsCompletedEvents = async (
    filter: RedemptionsCompletedEventFilter
  ): Promise<RedemptionsCompletedEvent[]> => {
    const { walletPublicKeyHash, fromBlock, toBlock } = filter

    // TODO: Use `getContractPastEvents` to fetch events once we provide a fix
    // in the `ethers.js` lib. This is a workaround to get the
    // `RedemptionsCompleted` events by `walletPublicKeyHash` param. The
    // `ethers.js` lib encodes the `bytesX` param in the wrong way.
    const filterTopics = [
      utils.id("RedemptionsCompleted(bytes20,bytes32)"),
      this._encodeWalletPublicKeyHash(walletPublicKeyHash),
    ]

    const logs = await this.bridgeContract!.queryFilter(
      {
        address: this.bridgeContract!.address,
        // @ts-ignore
        topics: filterTopics,
      },
      fromBlock,
      toBlock
    )

    return logs.map((log) => ({
      walletPublicKeyHash: log.args?.walletPubKeyHash.toString(),
      redemptionBitcoinTxHash: Hex.from(log.args?.redemptionTxHash.toString())
        .reverse()
        .toString(),
      blockNumber: log.blockNumber,
      txHash: log.transactionHash,
    }))
  }

  getEstimatedRedemptionFees = async (
    redemptionAmount: string
  ): Promise<{
    treasuryFee: string
    estimatedAmountToBeReceived: string
  }> => {
    const { satoshis: redemptionAmountInSatoshi } =
      this._amountToSatoshi(redemptionAmount)

    const redemptionTreasuryFeeDivisor =
      await this.getRedemptionTreasuryFeeDivisor()

    if (!redemptionTreasuryFeeDivisor) {
      throw new Error("Redemption treasury fee divisor not found.")
    }

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/bridge/Redemption.sol#L478
    const treasuryFee = BigNumber.from(redemptionTreasuryFeeDivisor).gt(0)
      ? BigNumber.from(redemptionAmountInSatoshi).div(
          redemptionTreasuryFeeDivisor
        )
      : ZERO

    const estimatedAmountToBeReceived = BigNumber.from(
      redemptionAmountInSatoshi
    ).sub(treasuryFee)

    return {
      treasuryFee: fromSatoshiToTokenPrecision(treasuryFee).toString(),
      estimatedAmountToBeReceived: estimatedAmountToBeReceived.toString(),
    }
  }

  private getRedemptionTreasuryFeeDivisor = async () => {
    if (!this._redemptionTreasuryFeeDivisor) {
      const { redemptionTreasuryFeeDivisor } =
        await this.bridgeContract!.redemptionParameters()
      this._redemptionTreasuryFeeDivisor = redemptionTreasuryFeeDivisor
    }

    return this._redemptionTreasuryFeeDivisor
  }
}
