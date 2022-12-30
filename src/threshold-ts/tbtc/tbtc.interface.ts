import { EthereumBridge } from "@keep-network/tbtc-v2.ts"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { MockBitcoinClient } from "../../tbtc/mock-bitcoin-client"

export enum BridgeHistoryStatus {
  PENDING,
  MINTED,
  ERROR,
}

export interface BridgeTxHistory {
  status: BridgeHistoryStatus
  txHash: string
  amount: string
}

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

  // TODO: figure out a better name?
  bridgeTxHistory(depositor: string): Promise<BridgeTxHistory[]>
}
