import {
  BitcoinAddressConverter,
  BitcoinClient,
  BitcoinNetwork,
  BitcoinRawTx,
  BitcoinTx,
  BitcoinTxHash,
  BitcoinTxMerkleBranch,
  BitcoinUtxo,
  DepositFunding,
  DepositReceipt,
  DepositScript,
  Hex,
} from "@keep-network/tbtc-v2.ts"
import { BigNumber } from "ethers"
import { RootState } from "../store"
import { getChainIdentifier } from "../threshold-ts/utils"
import { delay } from "../utils/helpers"

const testnetTransactionHash = Hex.from(
  "2f952bdc206bf51bb745b967cb7166149becada878d3191ffe341155ebcd4883"
)
const testnetTransaction: BitcoinRawTx = {
  transactionHex:
    "0100000000010162cae24e74ad64f9f0493b09f3964908b3b3038f4924882d3dbd853b" +
    "4c9bc7390100000000ffffffff02102700000000000017a914867120d5480a9cc0c11c" +
    "1193fa59b3a92e852da78710043c00000000001600147ac2d9378a1c47e589dfb8095c" +
    "a95ed2140d272602483045022100b70bd9b7f5d230444a542c7971bea79786b4ebde67" +
    "03cee7b6ee8cd16e115ebf02204d50ea9d1ee08de9741498c2cc64266e40d52c4adb9e" +
    "f68e65aa2727cd4208b5012102ee067a0273f2e3ba88d23140a24fdb290f27bbcd0f94" +
    "117a9c65be3911c5c04e00000000",
}
export const testnetUTXO: BitcoinUtxo & BitcoinRawTx = {
  transactionHash: testnetTransactionHash,
  outputIndex: 1,
  value: BigNumber.from(3933200),
  ...testnetTransaction,
}
const testnetPrivateKey = "cRJvyxtoggjAm9A94cB86hZ7Y62z2ei5VNJHLksFi2xdnz1GJ6xt"

/**
 * The average transaction fee for the Bitcoin network, ~ 0.0000002 BTC.
 * This value is used to calculate the fee for transactions on the Bitcoin network.
 */
const bitcoinNetworkTransactionFee = BigNumber.from(1520)

export class MockBitcoinClient implements BitcoinClient {
  private _unspentTransactionOutputs = new Map<string, BitcoinUtxo[]>()
  private _rawTransactions = new Map<string, BitcoinRawTx>()
  private _transactions = new Map<string, BitcoinTx>()
  private _confirmations = new Map<string, number>()
  private _latestHeight = 0
  private _headersChain = Hex.from("")
  private _transactionMerkle: BitcoinTxMerkleBranch = {
    blockHeight: 0,
    merkle: [],
    position: 0,
  }
  private _broadcastLog: BitcoinRawTx[] = []
  private _isMockingDepositTransactionInProgress = false

  /**
   * Array of transaction hashed for which we already started the process of
   * confirmations mocking.
   */
  private _txHashesWithMockedConfirmations: BitcoinTxHash[] = []

  set unspentTransactionOutputs(value: Map<string, BitcoinUtxo[]>) {
    this._unspentTransactionOutputs = value
  }

  set rawTransactions(value: Map<string, BitcoinRawTx>) {
    this._rawTransactions = value
  }

  set transactions(value: Map<string, BitcoinTx>) {
    this._transactions = value
  }

  set confirmations(value: Map<string, number>) {
    this._confirmations = value
  }

  set latestHeight(value: number) {
    this._latestHeight = value
  }

  set headersChain(value: Hex) {
    this._headersChain = value
  }

  set transactionMerkle(value: BitcoinTxMerkleBranch) {
    this._transactionMerkle = value
  }

  get broadcastLog(): BitcoinRawTx[] {
    return this._broadcastLog
  }

  async findAllUnspentTransactionOutputs(
    address: string
  ): Promise<BitcoinUtxo[]> {
    let utxos = this._unspentTransactionOutputs.get(address) || []
    const isDepositTransactionMocked = utxos && utxos.length > 0
    const shouldInitiateMocking =
      !isDepositTransactionMocked &&
      !this._isMockingDepositTransactionInProgress

    // Mocks deposit transaction only once for specific deposit address
    if (shouldInitiateMocking) {
      const store = (await import("../store")).default
      const { tbtc } = store.getState() as RootState

      const {
        ethAddress,
        btcRecoveryAddress,
        walletPublicKeyHash,
        refundLocktime,
        blindingFactor,
      } = tbtc
      const network = await this.getNetwork()

      const depositReceipt: DepositReceipt = {
        depositor: getChainIdentifier(ethAddress),
        blindingFactor: Hex.from(blindingFactor),
        walletPublicKeyHash: Hex.from(walletPublicKeyHash),
        refundPublicKeyHash: BitcoinAddressConverter.addressToPublicKeyHash(
          btcRecoveryAddress,
          network
        ),
        refundLocktime: Hex.from(refundLocktime),
      }

      await this._mockDepositTransaction(depositReceipt)
    }

    utxos = this._unspentTransactionOutputs.get(address) as BitcoinUtxo[]

    return utxos.length > 0 ? utxos.reverse() : utxos
  }

  private async _mockDepositTransaction(
    depositReceipt: DepositReceipt
  ): Promise<void> {
    // Since we are using a delay function we don't want to mock multiple
    // deposit transactions here when calling `findAllUnspentTransactionOutputs`
    // method. This is why we embrace `_isMockingDepositTransactionInProgress`
    // flag
    this._isMockingDepositTransactionInProgress = true

    await delay(5000)

    const network = await this.getNetwork()

    const depositScript = DepositScript.fromReceipt(depositReceipt, true)
    const depositFunding = DepositFunding.fromScript(depositScript)
    const depositAddress = await depositScript.deriveAddress(network)

    const primaryDepositAmount = BigNumber.from("1600000")
    const secondaryDepositAmount = BigNumber.from("1500000")

    const {
      transactionHash: primaryTransactionHash,
      depositUtxo: primaryDepositUtxo,
      rawTransaction: primaryTransaction,
    } = await depositFunding.assembleTransaction(
      network,
      primaryDepositAmount,
      [testnetUTXO],
      bitcoinNetworkTransactionFee,
      testnetPrivateKey
    )

    // Mocking secondary deposit transaction basing on primary transaction

    const secondaryTestnetUTXO = {
      ...primaryDepositUtxo,
      outputIndex: 1,
      ...primaryTransaction,
    }

    const {
      transactionHash: secondaryTransactionHash,
      depositUtxo: secondaryDepositUtxo,
      rawTransaction: secondaryTransaction,
    } = await depositFunding.assembleTransaction(
      network,
      secondaryDepositAmount,
      [secondaryTestnetUTXO],
      bitcoinNetworkTransactionFee,
      testnetPrivateKey
    )

    const utxos = new Map<string, BitcoinUtxo[]>()
    // utxos.set(depositAddress, [primaryDepositUtxo, secondaryDepositUtxo])

    this.unspentTransactionOutputs = utxos
    const rawTransactions = new Map<string, BitcoinRawTx>()
    rawTransactions.set(primaryTransactionHash.toString(), primaryTransaction)
    rawTransactions.set(
      secondaryTransactionHash.toString(),
      secondaryTransaction
    )
    this.rawTransactions = rawTransactions

    this._isMockingDepositTransactionInProgress = false
  }

  /**
   * Mocks the confirmations for the given transaction based on it's hash. Adds
   * a new confirmation every 8 seconds.
   *
   * @param {TransactionHash} transactionHash Hash of the transaction for which
   * we want to mock the confirmations
   * @param {number} confirmations (optional) Number of confirmations we want to
   * mock fo the given transaction (default = 10)
   */
  private async _mockConfirmationsForTransaction(
    transactionHash: BitcoinTxHash,
    confirmations: number = 10
  ): Promise<void> {
    this._confirmations.set(transactionHash.toString(), 0)
    for (let i = 0; i < confirmations; i++) {
      await delay(8000)
      this._confirmations.set(transactionHash.toString(), i + 1)
    }
  }

  async getTransaction(transactionHash: BitcoinTxHash): Promise<BitcoinTx> {
    return this._transactions.get(transactionHash.toString()) as BitcoinTx
  }

  async getRawTransaction(
    transactionHash: BitcoinTxHash
  ): Promise<BitcoinRawTx> {
    return this._rawTransactions.get(transactionHash.toString()) as BitcoinRawTx
  }

  async getTransactionConfirmations(
    transactionHash: BitcoinTxHash
  ): Promise<number> {
    if (!this._txHashesWithMockedConfirmations.includes(transactionHash)) {
      this._mockConfirmationsForTransaction(transactionHash)
      this._txHashesWithMockedConfirmations.push(transactionHash)
    }
    return this._confirmations.get(transactionHash.toString()) as number
  }

  async latestBlockHeight(): Promise<number> {
    return this._latestHeight
  }

  async getHeadersChain(
    blockHeight: number,
    chainLength: number
  ): Promise<Hex> {
    return this._headersChain
  }

  async getTransactionMerkle(
    transactionHash: BitcoinTxHash,
    blockHeight: number
  ): Promise<BitcoinTxMerkleBranch> {
    return this._transactionMerkle
  }

  async broadcast(transaction: BitcoinRawTx): Promise<void> {
    this._broadcastLog.push(transaction)
    return
  }

  async getNetwork(): Promise<BitcoinNetwork> {
    return BitcoinNetwork.Testnet
  }

  async getTransactionHistory(
    address: string,
    limit?: number | undefined
  ): Promise<BitcoinTx[]> {
    return []
  }

  async getTxHashesForPublicKeyHash(
    publicKeyHash: Hex
  ): Promise<BitcoinTxHash[]> {
    return new Promise<BitcoinTxHash[]>((resolve, _) => {
      const hashes = [] as BitcoinTxHash[]
      if (hashes) {
        resolve(hashes)
      } else {
        resolve([])
      }
    })
  }
}
