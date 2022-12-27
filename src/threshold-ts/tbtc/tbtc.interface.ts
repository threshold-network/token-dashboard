import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"

export interface ITBTC {
  suggestDepositWallet(): Promise<string | undefined>

  createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters>

  calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters,
    network: string
  ): Promise<string>

  findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]>

  revealDeposit(
    utxo: UnspentTransactionOutput,
    deposit: DepositScriptParameters
  ): Promise<string>
}
