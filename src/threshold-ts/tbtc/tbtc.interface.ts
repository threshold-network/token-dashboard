import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import {
  DepositScriptParameters,
  Deposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"

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

  revealDeposit(utxo: UnspentTransactionOutput, deposit: Deposit): Promise<void>
}
