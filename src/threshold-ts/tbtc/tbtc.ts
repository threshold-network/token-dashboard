import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  Deposit,
  DepositScriptParameters,
  revealDeposit,
  submitDepositTransaction,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { unprefixedAndUncheckedAddress } from "../utils"
import {
  computeHash160,
  decodeBitcoinAddress,
  RawTransaction,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { BigNumber, providers, Signer, VoidSigner } from "ethers"
import { ITBTC } from "./tbtc.interface"
import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"
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

  async suggestDepositWallet(): Promise<string | undefined> {
    // TODO: Remove this and use this._bridge.activeWalletPublicKey()
    return new Promise((resolve) => {
      resolve(
        "03989d253b17a6a0f41838b84ff0d20e8898f9d7b1a98f2564da4cc29dcf8581d9"
      )
    })
    return await this._bridge.activeWalletPublicKey()
  }

  async createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> {
    // TODO: check network
    if (!isValidBtcAddress(btcRecoveryAddress, Network.testnet)) {
      throw new Error(
        "Wrong bitcoin address passed to createDepositScriptParameters function"
      )
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

    const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
      blindingFactor,
      walletPublicKeyHash,
      refundPublicKeyHash,
      refundLocktime,
    }

    return depositScriptParameters
  }

  async calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters,
    network = "main"
  ): Promise<string> {
    // TODO: we should probalby mock it somewhere else
    await this._bitcoinClient.mockDepositTransaction(
      depositScriptParameters,
      "2500"
    )
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

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
}
