import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import { validate as isValidBtcAddress } from "bitcoin-address-validation"
import { getProviderOrSigner, unprefixedAndUncheckedAddress } from "../utils"
import {
  Client,
  computeHash160,
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { ITBTC } from "./tbtc.interface"
import { ElectrumClient, EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"
import { BitcoinConfig, EthereumConfig } from "../types"
import { BitcoinNetwork } from "../../types"

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _bitcoinClient: Client
  /**
   * Deposit refund locktime duration in seconds.
   * This is 9 month in seconds assuming 1 month = 30 days
   */
  private _depositRefundLocktimDuration = 23328000
  bitcoinNetwork: BitcoinNetwork

  constructor(ethereumConfig: EthereumConfig, bitcoinConfig: BitcoinConfig) {
    if (!bitcoinConfig.client && !bitcoinConfig.credentials) {
      throw new Error(
        "Neither bitcoin client nor bitcoin credentials are specified"
      )
    }
    this._bridge = new EthereumBridge({
      address: BridgeArtifact.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ) as any,
    })
    this._bitcoinClient =
      bitcoinConfig.client ||
      (!!bitcoinConfig.credentials
        ? new ElectrumClient(bitcoinConfig.credentials)
        : new MockBitcoinClient())
    this.bitcoinNetwork = bitcoinConfig.network
  }

  private _getBitcoinNetworkForTBTCLib = (): string => {
    if (this.bitcoinNetwork === BitcoinNetwork.mainnet) {
      return "main"
    }
    return this.bitcoinNetwork
  }

  suggestDepositWallet = async (): Promise<string | undefined> => {
    const walletPublicKey = await this._bridge.activeWalletPublicKey()
    // TODO: Remove this if
    if (walletPublicKey) {
      const walletPubKeyHash = computeHash160(walletPublicKey)
      console.log("walletPublicKeyHash", walletPubKeyHash)
    }
    return walletPublicKey
  }

  createDepositScriptParameters = async (
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> => {
    if (!isValidBtcAddress(btcRecoveryAddress, this.bitcoinNetwork as any)) {
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

    const refundLocktime = calculateDepositRefundLocktime(
      currentTimestamp,
      this._depositRefundLocktimDuration
    )
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

  calculateDepositAddress = async (
    depositScriptParameters: DepositScriptParameters
  ): Promise<string> => {
    const network = this._getBitcoinNetworkForTBTCLib()
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

  findAllUnspentTransactionOutputs = async (
    address: string
  ): Promise<UnspentTransactionOutput[]> => {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  revealDeposit = async (
    utxo: UnspentTransactionOutput,
    deposit: DepositScriptParameters
  ): Promise<string> => {
    return await tBTCRevealDeposit(
      utxo,
      deposit,
      this._bitcoinClient,
      this._bridge
    )
  }
}
