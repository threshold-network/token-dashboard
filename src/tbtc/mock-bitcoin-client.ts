import {
  Client,
  decodeBitcoinAddress,
  RawTransaction,
  Transaction,
  TransactionHash,
  TransactionMerkleBranch,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import {
  assembleDepositTransaction,
  calculateDepositAddress,
  Deposit,
  DepositScriptParameters,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
import { BigNumber } from "ethers"
import { unprefixedAndUncheckedAddress } from "../threshold-ts/utils"

const testnetTransactionHash = TransactionHash.from(
  "2f952bdc206bf51bb745b967cb7166149becada878d3191ffe341155ebcd4883"
)
const testnetTransaction: RawTransaction = {
  transactionHex:
    "0100000000010162cae24e74ad64f9f0493b09f3964908b3b3038f4924882d3dbd853b" +
    "4c9bc7390100000000ffffffff02102700000000000017a914867120d5480a9cc0c11c" +
    "1193fa59b3a92e852da78710043c00000000001600147ac2d9378a1c47e589dfb8095c" +
    "a95ed2140d272602483045022100b70bd9b7f5d230444a542c7971bea79786b4ebde67" +
    "03cee7b6ee8cd16e115ebf02204d50ea9d1ee08de9741498c2cc64266e40d52c4adb9e" +
    "f68e65aa2727cd4208b5012102ee067a0273f2e3ba88d23140a24fdb290f27bbcd0f94" +
    "117a9c65be3911c5c04e00000000",
}
const testnetUTXO: UnspentTransactionOutput & RawTransaction = {
  transactionHash: testnetTransactionHash,
  outputIndex: 1,
  value: BigNumber.from(3933200),
  ...testnetTransaction,
}
const testnetPrivateKey = "cRJvyxtoggjAm9A94cB86hZ7Y62z2ei5VNJHLksFi2xdnz1GJ6xt"

export class MockBitcoinClient implements Client {
  private isDepositTransactionMocked = false
  private _unspentTransactionOutputs = new Map<
    string,
    UnspentTransactionOutput[]
  >()
  private _rawTransactions = new Map<string, RawTransaction>()
  private _transactions = new Map<string, Transaction>()
  private _confirmations = new Map<string, number>()
  private _latestHeight = 0
  private _headersChain = ""
  private _transactionMerkle: TransactionMerkleBranch = {
    blockHeight: 0,
    merkle: [],
    position: 0,
  }
  private _broadcastLog: RawTransaction[] = []

  set unspentTransactionOutputs(
    value: Map<string, UnspentTransactionOutput[]>
  ) {
    this._unspentTransactionOutputs = value
  }

  set rawTransactions(value: Map<string, RawTransaction>) {
    this._rawTransactions = value
  }

  set transactions(value: Map<string, Transaction>) {
    this._transactions = value
  }

  set confirmations(value: Map<string, number>) {
    this._confirmations = value
  }

  set latestHeight(value: number) {
    this._latestHeight = value
  }

  set headersChain(value: string) {
    this._headersChain = value
  }

  set transactionMerkle(value: TransactionMerkleBranch) {
    this._transactionMerkle = value
  }

  get broadcastLog(): RawTransaction[] {
    return this._broadcastLog
  }

  async findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]> {
    // Mocks deposit transaction only once
    if (!this.isDepositTransactionMocked) {
      const store = (await import("../store")).default
      const { tbtc } = store.getState()

      const {
        ethAddress,
        btcRecoveryAddress,
        walletPublicKeyHash,
        refundLocktime,
        blindingFactor,
      } = tbtc

      const depositScriptParameters: DepositScriptParameters = {
        depositor: {
          identifierHex: unprefixedAndUncheckedAddress(ethAddress),
        },
        blindingFactor: blindingFactor,
        // TODO: pass proper values for walletPubKey and refundPubKey
        walletPublicKeyHash: walletPublicKeyHash,
        refundPublicKeyHash: decodeBitcoinAddress(btcRecoveryAddress),
        refundLocktime: refundLocktime,
      }

      await this.mockDepositTransaction(depositScriptParameters)
    }

    return new Promise<UnspentTransactionOutput[]>((resolve, _) => {
      resolve(
        this._unspentTransactionOutputs.get(
          address
        ) as UnspentTransactionOutput[]
      )
    })
  }

  async mockDepositTransaction(
    depositScriptParameters: DepositScriptParameters
  ): Promise<void> {
    const depositAddress = await calculateDepositAddress(
      depositScriptParameters,
      "testnet",
      true
    )

    const deposit: Deposit = {
      ...depositScriptParameters,
      amount: BigNumber.from("1000000"),
    }

    const {
      transactionHash,
      depositUtxo,
      rawTransaction: transaction,
    } = await assembleDepositTransaction(
      deposit,
      [testnetUTXO],
      testnetPrivateKey,
      true
    )

    // mock second deposit transaction

    const testnetUtxo2 = {
      ...depositUtxo,
      outputIndex: 1,
      ...transaction,
    }

    const deposit2: Deposit = {
      ...depositScriptParameters,
      amount: BigNumber.from("1000001"),
    }

    const {
      transactionHash: transactionHash2,
      depositUtxo: depositUtxo2,
      rawTransaction: transaction2,
    } = await assembleDepositTransaction(
      deposit2,
      [testnetUtxo2],
      testnetPrivateKey,
      true
    )

    const utxos = new Map<string, UnspentTransactionOutput[]>()
    utxos.set(depositAddress, [depositUtxo, depositUtxo2])
    this.unspentTransactionOutputs = utxos
    const rawTransactions = new Map<string, RawTransaction>()
    rawTransactions.set(transactionHash.toString(), transaction)
    rawTransactions.set(transactionHash2.toString(), transaction2)
    this.rawTransactions = rawTransactions

    this.isDepositTransactionMocked = true
  }

  getTransaction(transactionHash: TransactionHash): Promise<Transaction> {
    return new Promise<Transaction>((resolve, _) => {
      resolve(this._transactions.get(transactionHash.toString()) as Transaction)
    })
  }

  getRawTransaction(transactionHash: TransactionHash): Promise<RawTransaction> {
    return new Promise<RawTransaction>((resolve, _) => {
      resolve(
        this._rawTransactions.get(transactionHash.toString()) as RawTransaction
      )
    })
  }

  getTransactionConfirmations(
    transactionHash: TransactionHash
  ): Promise<number> {
    return new Promise<number>((resolve, _) => {
      resolve(this._confirmations.get(transactionHash.toString()) as number)
    })
  }

  latestBlockHeight(): Promise<number> {
    return new Promise<number>((resolve, _) => {
      resolve(this._latestHeight)
    })
  }

  getHeadersChain(blockHeight: number, chainLength: number): Promise<string> {
    return new Promise<string>((resolve, _) => {
      resolve(this._headersChain)
    })
  }

  getTransactionMerkle(
    transactionHash: TransactionHash,
    blockHeight: number
  ): Promise<TransactionMerkleBranch> {
    return new Promise<TransactionMerkleBranch>((resolve, _) => {
      resolve(this._transactionMerkle)
    })
  }

  broadcast(transaction: RawTransaction): Promise<void> {
    this._broadcastLog.push(transaction)
    return new Promise<void>((resolve, _) => {
      resolve()
    })
  }
}
