import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
  getRevealedDeposit as tBTCgetRevealedDeposit,
  RevealedDeposit,
} from "@keep-network/tbtc-v2.ts/dist/src/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  getContract,
  getProviderOrSigner,
  isValidBtcAddress,
  getContractPastEvents,
  getChainIdentifier,
  ZERO,
  isPublicKeyHashTypeAddress,
  isSameETHAddress,
  AddressZero,
  isPayToScriptHashTypeAddress,
  fromSatoshiToTokenPrecision,
} from "../utils"
import {
  Client,
  computeHash160,
  createOutputScriptFromAddress,
  decodeBitcoinAddress,
  Transaction as BitcoinTransaction,
  TransactionHash,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import {
  ElectrumClient,
  EthereumBridge,
  EthereumTBTCToken,
  Hex,
} from "@keep-network/tbtc-v2.ts/dist/src"
import {
  BitcoinConfig,
  BitcoinNetwork,
  EthereumConfig,
  UnspentTransactionOutputPlainObject,
} from "../types"
import TBTCVault from "@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import Bridge from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import TBTCToken from "@keep-network/tbtc-v2/artifacts/TBTC.json"
import { BigNumber, BigNumberish, Contract, utils } from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { BlockTag } from "@ethersproject/abstract-provider"
import { LogDescription } from "ethers/lib/utils"
import {
  requestRedemption,
  findWalletForRedemption,
} from "@keep-network/tbtc-v2.ts/dist/src/redemption"
import { TBTCToken as ChainTBTCToken } from "@keep-network/tbtc-v2.ts/dist/src/chain"

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

interface RedemptionRequest<NumberType extends BigNumberish = BigNumber> {
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

export type RedemptionWalletData = Awaited<
  ReturnType<typeof findWalletForRedemption>
>

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

export interface ITBTC {
  /**
   * Bitcoin network specified in the bitcoin config that we pass to the
   * threshold lib
   * @returns {BitcoinNetwork}
   */
  readonly bitcoinNetwork: BitcoinNetwork

  readonly bridgeContract: Contract

  readonly vaultContract: Contract

  readonly tokenContract: Contract

  /**
   * Suggests a wallet that should be used as the deposit target at the given
   * moment.
   * @returns Compressed (33 bytes long with 02 or 03 prefix) public key of
   * the wallet.
   */
  suggestDepositWallet(): Promise<string | undefined>

  /**
   * Creates parameters needed to construct a deposit address from the data that
   * we gather from the user, which are eth address and btc recovery address.
   * @param ethAddress Eth address in which the user will receive tBTC (it
   * should be the address that the user is connected to).
   * @param btcRecoveryAddress The bitcoin address in which the user will
   * receive the bitcoin back in case something goes wrong.
   * @returns All deposit script parameters needed to create a deposit address.
   */
  createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters>

  /**
   * Calculates the deposit address from the deposit script parameters
   * @param depositScriptParameters Deposit script parameters. You can get them
   * from @see{createDepositScriptParameters} method
   * @returns Deposit address
   */
  calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters
  ): Promise<string>

  /**
   * Finds all unspent transaction outputs (UTXOs) for a given Bitcoin address.
   * @param address - Bitcoin address UTXOs should be determined for.
   * @returns List of UTXOs.
   */
  findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]>

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
  }>

  /**
   * Reveals the given deposit to the on-chain Bridge contract.
   * @param utxo Deposit UTXO of the revealed deposit
   * @param depositScriptParameters Deposit script parameters. You can get them
   * from @see{createDepositScriptParameters} method
   */
  revealDeposit(
    utxo: UnspentTransactionOutput,
    depositScriptParameters: DepositScriptParameters
  ): Promise<string>

  /**
   * Gets a revealed deposit from the bridge.
   * @param utxo Deposit UTXO of the revealed deposit
   * @returns Revealed deposit data.
   */
  getRevealedDeposit(utxo: UnspentTransactionOutput): Promise<RevealedDeposit>

  /**
   * Gets the number of confirmations that a given transaction has accumulated
   * so far.
   * @param transactionHash Hash of the transaction.
   * @returns The number of confirmations.
   */
  getTransactionConfirmations(transactionHash: TransactionHash): Promise<number>

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
  bridgeActivity(account: string): Promise<BridgeActivity[]>

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
   * @param walletPublicKey The Bitcoin public key of the wallet. Must be in the
   * compressed form (33 bytes long with 02 or 03 prefix).
   * @param mainUtxo The main UTXO of the wallet. Must match the main UTXO held
   * by the on-chain Bridge contract.
   * @param btcAddress The Bitcoin address that the redeemed funds will be
   * locked to.
   * @param amount The amount to be redeemed in tBTC token unit.
   * @returns Transaction hash of the request redemption transaction.
   */
  requestRedemption(
    walletPublicKey: string,
    mainUtxo: UnspentTransactionOutputPlainObject,
    btcAddress: string,
    amount: BigNumberish
  ): Promise<string>

  /**
   * Finds the oldest active wallet that has enough BTC to handle a redemption
   * request.
   * @param amount The amount to be redeemed in tBTC token precision.
   * @param btcAddress The Bitcoin address the redeemed funds are supposed to be
   *        locked on.
   * @returns Promise with the wallet details needed to request a redemption.
   */
  findWalletForRedemption(
    amount: BigNumberish,
    btcAddress: string
  ): Promise<RedemptionWalletData>

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
   * @param transactionHash Hash of the transaction.
   * @returns Transaction object.
   */
  getBitcoinTransaction(transactionHash: string): Promise<BitcoinTransaction>

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
  private _bridge: EthereumBridge
  private _tbtcVault: Contract
  private _bitcoinClient: Client
  private _multicall: IMulticall
  private _bridgeContract: Contract
  private _token: ChainTBTCToken
  private _tokenContract: Contract
  /**
   * Deposit refund locktime duration in seconds.
   * This is 9 month in seconds assuming 1 month = 30 days
   */
  private _depositRefundLocktimDuration = 23328000
  private _bitcoinConfig: BitcoinConfig
  private readonly _satoshiMultiplier = BigNumber.from(10).pow(10)

  private _redemptionTreasuryFeeDivisor: BigNumber | undefined

  constructor(
    ethereumConfig: EthereumConfig,
    bitcoinConfig: BitcoinConfig,
    multicall: IMulticall
  ) {
    if (!bitcoinConfig.client && !bitcoinConfig.credentials) {
      throw new Error(
        "Neither bitcoin client nor bitcoin credentials are specified"
      )
    }
    this._bridge = new EthereumBridge({
      address: Bridge.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ),
    })
    this._tbtcVault = getContract(
      TBTCVault.address,
      TBTCVault.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
    this._bridgeContract = getContract(
      Bridge.address,
      Bridge.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
    this._bitcoinClient =
      bitcoinConfig.client ??
      new ElectrumClient(
        bitcoinConfig.credentials!,
        bitcoinConfig.clientOptions
      )
    this._multicall = multicall
    this._bitcoinConfig = bitcoinConfig
    this._token = new EthereumTBTCToken({
      address: TBTCToken.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ),
    })
    this._tokenContract = getContract(
      TBTCToken.address,
      TBTCToken.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
  }

  get bitcoinNetwork(): BitcoinNetwork {
    return this._bitcoinConfig.network
  }

  get bridgeContract() {
    return this._bridgeContract
  }

  get vaultContract() {
    return this._tbtcVault
  }

  get tokenContract() {
    return this._tokenContract
  }

  suggestDepositWallet = async (): Promise<string | undefined> => {
    return await this._bridge.activeWalletPublicKey()
  }

  createDepositScriptParameters = async (
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> => {
    const { network } = this._bitcoinConfig
    if (!isValidBtcAddress(btcRecoveryAddress, network as any)) {
      throw new Error(
        "Wrong bitcoin address passed to createDepositScriptParameters function"
      )
    }

    if (!isPublicKeyHashTypeAddress(btcRecoveryAddress)) {
      throw new Error("Bitcoin recovery address must be a P2PKH or P2WPKH")
    }

    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    const blindingFactor = CryptoJS.lib.WordArray.random(8).toString(
      CryptoJS.enc.Hex
    )
    const walletPublicKey = await this.suggestDepositWallet()

    if (!walletPublicKey) {
      throw new Error("Couldn't get active wallet public key!")
    }

    const walletPublicKeyHash = computeHash160(walletPublicKey)

    const refundPublicKeyHash = decodeBitcoinAddress(btcRecoveryAddress)

    const refundLocktime = calculateDepositRefundLocktime(
      currentTimestamp,
      this._depositRefundLocktimDuration
    )

    const depositScriptParameters: DepositScriptParameters = {
      depositor: getChainIdentifier(ethAddress),
      blindingFactor,
      walletPublicKeyHash,
      refundPublicKeyHash,
      refundLocktime,
    }

    return depositScriptParameters
  }

  calculateDepositAddress = async (
    depositScriptParameters: DepositScriptParameters
  ): Promise<string> => {
    return await calculateDepositAddress(
      depositScriptParameters,
      this.bitcoinNetwork,
      true
    )
  }

  findAllUnspentTransactionOutputs = async (
    address: string
  ): Promise<UnspentTransactionOutput[]> => {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  getEstimatedDepositFees = async (depositAmount: string) => {
    const { depositTreasuryFeeDivisor, optimisticMintingFeeDivisor } =
      await this._getDepositFees()

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/bridge/Deposit.sol#L258-L260
    const treasuryFee = BigNumber.from(depositTreasuryFeeDivisor).gt(0)
      ? BigNumber.from(depositAmount).div(depositTreasuryFeeDivisor)
      : ZERO

    const { amountToMint, optimisticMintFee } =
      this._calculateOptimisticMintingAmountAndFee(
        BigNumber.from(depositAmount),
        treasuryFee,
        optimisticMintingFeeDivisor
      )

    return {
      treasuryFee: treasuryFee.mul(this._satoshiMultiplier).toString(),
      optimisticMintFee: optimisticMintFee.toString(),
      amountToMint: amountToMint.toString(),
    }
  }

  private _getDepositFees = async (): Promise<{
    depositTreasuryFeeDivisor: BigNumber
    optimisticMintingFeeDivisor: BigNumber
  }> => {
    const calls: ContractCall[] = [
      {
        interface: this._bridgeContract.interface,
        address: Bridge.address,
        method: "depositParameters",
        args: [],
      },
      {
        interface: this._tbtcVault.interface,
        address: this._tbtcVault.address,
        method: "optimisticMintingFeeDivisor",
        args: [],
      },
    ]

    const [depositParams, _optimisticMintingFeeDivisor] =
      await this._multicall.aggregate(calls)

    const depositTreasuryFeeDivisor = BigNumber.from(
      depositParams.depositTreasuryFeeDivisor
    )
    const optimisticMintingFeeDivisor = BigNumber.from(
      _optimisticMintingFeeDivisor[0]
    )

    return {
      depositTreasuryFeeDivisor,
      optimisticMintingFeeDivisor,
    }
  }

  private _calculateOptimisticMintingAmountAndFee = (
    depositAmount: BigNumber,
    treasuryFee: BigNumber,
    optimisticMintingFeeDivisor: BigNumber
  ) => {
    const amountToMint = depositAmount
      .sub(treasuryFee)
      .mul(this._satoshiMultiplier)

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/vault/TBTCOptimisticMinting.sol#L328-L336
    const optimisticMintFee = BigNumber.from(optimisticMintingFeeDivisor).gt(0)
      ? amountToMint.div(optimisticMintingFeeDivisor)
      : ZERO

    return {
      optimisticMintFee: optimisticMintFee,
      amountToMint: amountToMint.sub(optimisticMintFee),
    }
  }

  revealDeposit = async (
    utxo: UnspentTransactionOutput,
    depositScriptParameters: DepositScriptParameters
  ): Promise<string> => {
    return await tBTCRevealDeposit(
      utxo,
      depositScriptParameters,
      this._bitcoinClient,
      this._bridge,
      getChainIdentifier(this._tbtcVault.address)
    )
  }

  getRevealedDeposit = async (
    utxo: UnspentTransactionOutput
  ): Promise<RevealedDeposit> => {
    return await tBTCgetRevealedDeposit(utxo, this._bridge)
  }

  getTransactionConfirmations = async (
    transactionHash: TransactionHash
  ): Promise<number> => {
    return await this._bitcoinClient.getTransactionConfirmations(
      transactionHash
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

  bridgeActivity = async (account: string): Promise<BridgeActivity[]> => {
    const depositActivities = await this._findDepositActivities(account)

    const redemptionActivities: BridgeActivity[] =
      await this._findRedemptionActivities(account)

    return depositActivities
      .concat(redemptionActivities)
      .sort((a, b) => b.blockNumber - a.blockNumber)
  }

  private _findDepositActivities = async (
    depositor: string
  ): Promise<BridgeActivity[]> => {
    // We can assume that all revealed deposits have `PENDING` status.
    const revealedDeposits = await this.findAllRevealedDeposits(depositor)
    const depositKeys = revealedDeposits.map((_) => _.depositKey)

    const mintedDepositEvents = await this._findAllMintedDeposits(
      depositor,
      depositKeys
    )

    const estimatedAmountToMintByDepositKey =
      await this._calculateEstimatedAmountToMintForRevealedDeposits(depositKeys)

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
      }
    })
  }

  findAllRevealedDeposits = async (
    depositor: string
  ): Promise<RevealedDepositEvent[]> => {
    const deposits = await getContractPastEvents(this._bridgeContract, {
      fromBlock: Bridge.receipt.blockNumber,
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

  private _calculateEstimatedAmountToMintForRevealedDeposits = async (
    depositKeys: string[]
  ): Promise<Map<string, BigNumber>> => {
    const { optimisticMintingFeeDivisor } = await this._getDepositFees()

    const deposits = (
      await this._multicall.aggregate(
        depositKeys.map((depositKey) => ({
          interface: this.bridgeContract.interface,
          address: this.bridgeContract.address,
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
            optimisticMintingFeeDivisor
          ).amountToMint,
        ]
      })
    )
  }

  private _getMintedAmountFromTxHash = async (
    optimisticMintingFinalizedTxHash: string,
    depositor: string
  ): Promise<[string, BigNumber]> => {
    const receipt = await this.tokenContract.provider.getTransactionReceipt(
      optimisticMintingFinalizedTxHash
    )

    // There is only one transfer to depositor account.
    const transferEvent = receipt.logs
      .filter((log) =>
        isSameETHAddress(log.address, this._tokenContract.address)
      )
      .map((log) => this._tokenContract.interface.parseLog(log))
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
    return await getContractPastEvents(this._tbtcVault, {
      fromBlock: TBTCVault.receipt.blockNumber,
      filterParams: [null, depositKeys, depositor],
      eventName: "OptimisticMintingFinalized",
    })
  }

  private _findAllCancelledDeposits = async (
    depositKeys: string[]
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    return getContractPastEvents(this._tbtcVault, {
      fromBlock: TBTCVault.receipt.blockNumber,
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
        await this._bridgeContract.provider.getBlock(event.blockNumber)
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
    const _txHash = TransactionHash.from(depositTxHash)

    return EthereumBridge.buildDepositKey(
      txHashByteOrder === "little-endian" ? _txHash.reverse() : _txHash,
      depositOutputIndex
    )
  }

  requestRedemption = async (
    walletPublicKey: string,
    mainUtxo: UnspentTransactionOutputPlainObject,
    btcAddress: string,
    amount: BigNumberish
  ): Promise<string> => {
    if (this._isValidBitcoinAddressForRedemption(btcAddress)) {
      throw new Error(
        "Unsupported BTC address! Supported type addresses are: P2PKH, P2WPKH, P2SH, P2WSH."
      )
    }

    const _mainUtxo: UnspentTransactionOutput = {
      transactionHash: Hex.from(mainUtxo.transactionHash),
      outputIndex: Number(mainUtxo.outputIndex),
      value: BigNumber.from(mainUtxo.value),
    }

    const tx = await requestRedemption(
      walletPublicKey,
      _mainUtxo,
      createOutputScriptFromAddress(btcAddress).toString(),
      BigNumber.from(amount),
      this._token
    )

    return tx.toPrefixedString()
  }

  findWalletForRedemption = async (
    amount: BigNumberish,
    btcAddress: string
  ): Promise<RedemptionWalletData> => {
    if (this._isValidBitcoinAddressForRedemption(btcAddress)) {
      throw new Error(
        "Unsupported BTC address! Supported type addresses are: P2PKH, P2WPKH, P2SH, P2WSH."
      )
    }
    const { satoshis } = this._amountToSatoshi(amount)

    const redeemerOutputScript =
      createOutputScriptFromAddress(btcAddress).toString()

    return await findWalletForRedemption(
      satoshis,
      redeemerOutputScript,
      this.bitcoinNetwork,
      this._bridge,
      this._bitcoinClient
    )
  }

  private _isValidBitcoinAddressForRedemption = (
    btcAddress: string
  ): boolean => {
    return (
      !isValidBtcAddress(btcAddress, this.bitcoinNetwork) ||
      (!isPublicKeyHashTypeAddress(btcAddress) &&
        !isPayToScriptHashTypeAddress(btcAddress))
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
  ): Promise<BitcoinTransaction> => {
    return this._bitcoinClient.getTransaction(
      TransactionHash.from(transactionHash)
    )
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

    const logs = await this.bridgeContract.queryFilter(
      {
        address: this.bridgeContract.address,
        // @ts-ignore
        topics: filterTopics,
      },
      fromBlock,
      toBlock
    )

    return logs
      .map((log) => ({
        ...this.bridgeContract.interface.parseLog(log),
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
    const [[pending], [timedOut]] = await this._multicall.aggregate([
      {
        interface: this._bridgeContract.interface,
        address: this._bridgeContract.address,
        method: "pendingRedemptions",
        args: [redemptionKey],
      },
      {
        interface: this._bridgeContract.interface,
        address: this._bridgeContract.address,
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

    const logs = await this.bridgeContract.queryFilter(
      {
        address: this.bridgeContract.address,
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

    const logs = await this.bridgeContract.queryFilter(
      {
        address: this.bridgeContract.address,
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
        await this.bridgeContract.redemptionParameters()
      this._redemptionTreasuryFeeDivisor = redemptionTreasuryFeeDivisor
    }

    return this._redemptionTreasuryFeeDivisor
  }
}
