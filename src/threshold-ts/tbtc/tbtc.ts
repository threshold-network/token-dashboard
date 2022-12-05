import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  Deposit,
  DepositScriptParameters,
  revealDeposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { unprefixedAndUncheckedAddress } from "../utils"
import {
  RawTransaction,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { BigNumber, providers, Signer, VoidSigner } from "ethers"
import { ITBTC } from "./tbtc.interface"
import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { MockBitcoinClient } from "./mock-bitcoin-client"
import { BitcoinConfig, EthereumConfig } from "../types"

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _bitcoinClient: MockBitcoinClient

  constructor(ethereumConfig: EthereumConfig, bitcoinConfig: BitcoinConfig) {
    const signer: Signer =
      ethereumConfig.providerOrSigner instanceof Signer
        ? ethereumConfig.providerOrSigner
        : this._getSignerFromProvider(ethereumConfig.providerOrSigner)
    this._bridge = new EthereumBridge({
      address: BridgeArtifact.address,
      signer: signer,
    })
    this._bitcoinClient = new MockBitcoinClient()
  }

  private _getSignerFromProvider(provider: providers.Provider): Signer {
    return new VoidSigner(
      "0x3c5d0B515C993D2E8b5044e3E5cBAE3B08796A01",
      provider
    )
  }

  //TODO: implement proper functionality
  async suggestDepositWallet(): Promise<string | undefined> {
    return await this._bridge.activeWalletPublicKey()
  }

  async createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> {
    // TODO: check network
    if (isValidBtcAddress(btcRecoveryAddress, Network.testnet)) {
      throw new Error(
        "Wrong bitcoin address passed to createDepositScriptParameters function"
      )
    }

    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    const blindingFactor = CryptoJS.lib.WordArray.random(8).toString(
      CryptoJS.enc.Hex
    )
    const walletPublicKeyHash = await this.suggestDepositWallet()

    if (!walletPublicKeyHash) {
      throw new Error("Couldn't get active wallet public key!")
    }

    const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
      blindingFactor,
      walletPublicKeyHash,
      // TODO: decode `btcRecoveryAddress` and pass it as refund public key
      refundPublicKeyHash:
        "0300d6f28a2f6bf9836f57fcda5d284c9a8f849316119779f0d6090830d97763a9",
      refundLocktime,
    }

    return depositScriptParameters
  }

  async calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters,
    network = "main"
  ): Promise<string> {
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

  //TODO: implement proper functionality
  async findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]> {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  //TODO: implement reveal deposit functionality
  async revealDeposit(
    utxo: UnspentTransactionOutput,
    deposit: Deposit
  ): Promise<void> {
    // TODO: Fix reveal deposit
    await revealDeposit(utxo, deposit, this._bitcoinClient, this._bridge)
  }

  mockDepositTransaction(depositAddress: string): void {
    const testnetTransactionHash =
      "2f952bdc206bf51bb745b967cb7166149becada878d3191ffe341155ebcd4883"

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

    const utxos = new Map<string, UnspentTransactionOutput[]>()
    utxos.set(depositAddress, [testnetUTXO])
    this._bitcoinClient.unspentTransactionOutputs = utxos

    const rawTransactions = new Map<string, RawTransaction>()
    rawTransactions.set(testnetTransactionHash, testnetTransaction)
    this._bitcoinClient.rawTransactions = rawTransactions
  }
}
