import { findWalletForRedemption } from "@keep-network/tbtc-v2.ts/dist/src/redemption"
import { BigNumberish, BigNumber, Contract } from "ethers"
import {
  BitcoinNetwork,
  Deposit,
  BitcoinUtxo,
  DepositRequest,
  BitcoinTxHash,
  BitcoinTx,
  TBTC as SDK,
} from "tbtc-sdk-v2"
import { BlockTag } from "@ethersproject/abstract-provider"

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

export type QueryEventFilter = { fromBlock?: BlockTag; toBlock?: BlockTag }

export type RedemptionRequestedEventFilter = {
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

export type RedemptionTimedOutEventFilter = {
  walletPublicKeyHash?: string | string[]
} & QueryEventFilter

export interface RedemptionTimedOutEvent {
  walletPublicKeyHash: string
  redeemerOutputScript: string
  txHash: string
  blockNumber: number
}

export type RedemptionsCompletedEventFilter = {
  walletPublicKeyHash: string
} & QueryEventFilter

export interface RedemptionsCompletedEvent {
  walletPublicKeyHash: string
  redemptionBitcoinTxHash: string
  txHash: string
  blockNumber: number
}

export type BitcoinTransactionHashByteOrder = "little-endian" | "big-endian"

export type RedemptionWalletData = Awaited<
  ReturnType<typeof findWalletForRedemption>
>

export type AmountToSatoshiResult = {
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

  readonly sdk: SDK

  readonly deposit: Deposit

  /**
   * Creates parameters needed to construct a deposit address from the data that
   * we gather from the user, which are eth address and btc recovery address.
   * @param ethAddress Eth address in which the user will receive tBTC (it
   * should be the address that the user is connected to).
   * @param btcRecoveryAddress The bitcoin address in which the user will
   * receive the bitcoin back in case something goes wrong.
   * @returns All deposit script parameters needed to create a deposit address.
   */
  initiateDeposit(btcRecoveryAddress: string): Promise<Deposit>

  /**
   * Calculates the deposit address from the deposit script parameters
   * @param depositScriptParameters Deposit script parameters. You can get them
   * from @see{initiateDeposit} method
   * @returns Deposit address
   */
  calculateDepositAddress(): Promise<string>

  /**
   * Finds all unspent transaction outputs (UTXOs) for a given Bitcoin address.
   * @param address - Bitcoin address UTXOs should be determined for.
   * @returns List of UTXOs.
   */
  findAllUnspentTransactionOutputs(address: string): Promise<BitcoinUtxo[]>

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
   * @param transactionHash Hash of the transaction.
   * @returns The number of confirmations.
   */
  getTransactionConfirmations(transactionHash: BitcoinTxHash): Promise<number>

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
  requestRedemption(btcAddress: string, amount: BigNumberish): Promise<string>

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
