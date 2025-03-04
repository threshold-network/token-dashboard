import { Signer, providers, utils } from "ethers"
import {
  Account,
  EthereumTransaction,
  WalletAPIClient,
  WindowMessageTransport,
} from "@ledgerhq/wallet-api-client"
import BigNumber from "bignumber.js"

export class LedgerLiveSigner extends Signer {
  private walletApiClient: WalletAPIClient
  private account: Account | undefined

  constructor(provider?: providers.Provider) {
    super()
    utils.defineReadOnly(this, "provider", provider)
    const transport = new WindowMessageTransport()
    this.walletApiClient = new WalletAPIClient(transport)
  }

  async getAddress(): Promise<string> {
    if (!this.account) throw new Error("Account not set")
    return this.account.address
  }

  setAccount(account: Account | undefined) {
    this.account = account
  }

  async signMessage(message: string | utils.Bytes): Promise<string> {
    if (!this.account) throw new Error("Account not set")
    const signedMessage = await this.walletApiClient.message.sign(
      this.account.id,
      Buffer.from(utils.arrayify(message))
    )
    return utils.hexlify(signedMessage)
  }

  async signTransaction(
    transaction: providers.TransactionRequest
  ): Promise<string> {
    if (!this.account) throw new Error("Account not set")
    const tx: EthereumTransaction = {
      family: "ethereum",
      amount: new BigNumber(transaction.value?.toString() || "0"),
      recipient: transaction.to || "",
      nonce: transaction.nonce ? Number(transaction.nonce) : undefined,
      data: transaction.data
        ? Buffer.from(utils.arrayify(transaction.data))
        : undefined,
      gasPrice: transaction.gasPrice
        ? new BigNumber(transaction.gasPrice.toString())
        : undefined,
      gasLimit: transaction.gasLimit
        ? new BigNumber(transaction.gasLimit.toString())
        : undefined,
      maxFeePerGas: transaction.maxFeePerGas
        ? new BigNumber(transaction.maxFeePerGas.toString())
        : undefined,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
        ? new BigNumber(transaction.maxPriorityFeePerGas.toString())
        : undefined,
    }

    const signedTx = await this.walletApiClient.transaction.sign(
      this.account.id,
      tx
    )
    return utils.hexlify(signedTx)
  }

  async sendTransaction(
    transaction: providers.TransactionRequest
  ): Promise<providers.TransactionResponse> {
    if (!this.provider) throw new Error("Provider not set")
    const signedTx = await this.signTransaction(transaction)
    return this.provider.sendTransaction(signedTx)
  }

  connect(provider: providers.Provider): LedgerLiveSigner {
    return new LedgerLiveSigner(provider)
  }
}
