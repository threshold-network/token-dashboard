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
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { BigNumber } from "ethers"
import { ITBTC } from "./tbtc.interface"
import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import { EthereumConfig } from "../types"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"

export class TBTC implements ITBTC {
  // private _bridge: EthereumBridge

  constructor(config: EthereumConfig) {
    // this._bridge = new EthereumBridge({
    //   address: BridgeArtifact.address,
    //   signer: "test",
    // })
  }

  //TODO: implement proper functionality
  async suggestDepositWallet(): Promise<string | undefined> {
    return new Promise<string>((resolve) => {
      resolve(
        "0300d6f28a2f6bf9836f57fcda5d284c9a8f849316119779f0d6090830d97763a9"
      )
    })
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
    const walletPublicKey = await this.suggestDepositWallet()

    if (!walletPublicKey) {
      throw new Error("Couldn't get active wallet public key!")
    }

    const refundLocktime = calculateDepositRefundLocktime(currentTimestamp)
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
      blindingFactor,
      walletPublicKey,
      // TODO: decode `btcRecoveryAddress` and pass it as refund public key
      refundPublicKey:
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
    const testnetUTXO: UnspentTransactionOutput = {
      transactionHash:
        "72e7fd57c2adb1ed2305c4247486ff79aec363296f02ec65be141904f80d214e",
      outputIndex: 0,
      value: BigNumber.from(101),
    }
    return new Promise<UnspentTransactionOutput[]>((resolve) => {
      resolve([testnetUTXO])
    })
  }

  //TODO: implement reveal deposit functionality
  async revealDeposit(
    utxo: UnspentTransactionOutput,
    deposit: Deposit
  ): Promise<void> {
    // await revealDeposit(utxo, deposit, null, null)
  }
}
