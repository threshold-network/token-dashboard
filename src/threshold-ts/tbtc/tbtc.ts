import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  Network,
  validate as isValidBtcAddress,
} from "bitcoin-address-validation"
import { Contract } from "ethers"
import {
  getContract,
  getProviderOrSigner,
  unprefixedAndUncheckedAddress,
  getContractPastEvents,
} from "../utils"
import {
  computeHash160,
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { BridgeHistoryStatus, BridgeTxHistory, ITBTC } from "./tbtc.interface"
import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import TBTCVault from "@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"
import { BitcoinConfig, EthereumConfig } from "../types"

export interface RevealedDeposit {
  amount: string
  walletPublicKeyHash: string
  fundingTxHash: string
  fundingOutputIndex: string
  depositKey: string
  txHash: string
}

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _bitcoinClient: MockBitcoinClient
  private _vault: Contract

  constructor(ethereumConfig: EthereumConfig, bitcoinConfig: BitcoinConfig) {
    this._bridge = new EthereumBridge({
      address: BridgeArtifact.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ) as any,
    })
    this._bitcoinClient = new MockBitcoinClient()
    this._vault = getContract(
      TBTCVault.address,
      TBTCVault.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
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

    const walletPubKeyHash = computeHash160(walletPublicKey)

    const refundPubKeyHash = decodeBitcoinAddress(btcRecoveryAddress)

    const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
      blindingFactor,
      walletPubKeyHash,
      refundPubKeyHash,
      refundLocktime,
    }

    return depositScriptParameters
  }

  calculateDepositAddress = async (
    depositScriptParameters: DepositScriptParameters,
    network = "main"
  ): Promise<string> => {
    // TODO: we should probalby mock it somewhere else
    await this._bitcoinClient.mockDepositTransaction(
      depositScriptParameters,
      "1000000"
    )
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

  findAllUnspentTransactionOutputs = async (
    address: string
  ): Promise<UnspentTransactionOutput[]> => {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  //TODO: implement reveal deposit functionality
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

  bridgeTxHistory = async (depositor: string): Promise<BridgeTxHistory[]> => {
    // We can assume that all revealed deposits has `PENDING` status.
    const revealedDeposits = await this._findAllRevealedDeposits(depositor)
    const depositKeys = revealedDeposits.map((_) => _.depositKey)

    const mintedDeposits = new Map(
      (await this._findAllMintedDeposits(depositor, depositKeys)).map((_) => [
        _.args?.depositKey,
        { txHash: _.transactionHash },
      ])
    )

    const cancelledDeposits = new Map(
      (await this._findAllCancelledDeposits(depositKeys)).map((_) => [
        _.args?.depositKey,
        { txHash: _.transactionHash },
      ])
    )

    return revealedDeposits.map((deposit) => {
      const { depositKey, amount, txHash: depositTxHash } = deposit
      let status = BridgeHistoryStatus.PENDING
      let txHash = depositTxHash
      if (mintedDeposits.has(depositKey)) {
        status = BridgeHistoryStatus.MINTED
        txHash = mintedDeposits.get(depositKey)?.txHash!
      } else if (cancelledDeposits.has(depositKey)) {
        status = BridgeHistoryStatus.ERROR
        txHash = cancelledDeposits.get(depositKey)?.txHash!
      }

      return { amount, txHash, status }
    })
  }

  private _findAllRevealedDeposits = async (
    depositor: string
  ): Promise<RevealedDeposit[]> => {
    // TODO: probably add a new function to the Ethereum Bridge implementation
    // to find all revealed deposits because we don't have access to the
    // `Contract`(from ethers lib) instance.
    return []
  }

  private _findAllMintedDeposits = async (
    depositor: string,
    depositKeys: string[] = []
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    return await getContractPastEvents(this._vault, {
      fromBlock: TBTCVault.receipt.blockNumber,
      filterParams: [null, depositKeys, depositor],
      eventName: "OptimisticMintingFinalized",
    })
  }

  private _findAllCancelledDeposits = async (
    depositKeys: string[]
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    return getContractPastEvents(this._vault, {
      fromBlock: TBTCVault.receipt.blockNumber,
      filterParams: [null, depositKeys],
      eventName: "OptimisticMintingCancelled",
    })
  }
}
