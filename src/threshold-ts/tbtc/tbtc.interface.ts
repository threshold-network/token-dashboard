import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { BitcoinNetwork } from "../types"

export interface ITBTC {
  getBitcoinNetwork(): BitcoinNetwork

  suggestDepositWallet(): Promise<string | undefined>

  createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters>

  calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters
  ): Promise<string>

  findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]>

  revealDeposit(
    utxo: UnspentTransactionOutput,
    deposit: DepositScriptParameters
  ): Promise<string>
}
