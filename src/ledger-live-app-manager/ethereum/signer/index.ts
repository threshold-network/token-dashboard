import { ethers, Signer } from "ethers"
import {
  Account,
  Transaction,
  WalletAPIClient,
  WindowMessageTransport,
} from "@ledgerhq/wallet-api-client"
import { Bytes } from "@ethersproject/bytes"
import BigNumber from "bignumber.js"
import { Hex } from "@keep-network/tbtc-v2.ts"
import { AddressZero } from "@ethersproject/constants"
import { Deferrable } from "@ethersproject/properties"

export class LedgerLiveEthereumSigner extends Signer {
  private _walletApiClient: WalletAPIClient
  private _windowMessageTransport: WindowMessageTransport
  account: Account | undefined

  constructor(
    provider: ethers.providers.Provider,
    windowMessageTransport: WindowMessageTransport,
    walletApiClient: WalletAPIClient
  ) {
    super()
    ethers.utils.defineReadOnly(this, "provider", provider || null)
    this._windowMessageTransport = windowMessageTransport
    this._walletApiClient = walletApiClient
  }

  async requestAccount(
    params: { currencyIds?: string[] | undefined } | undefined
  ): Promise<Account> {
    this._windowMessageTransport.connect()
    const _account = await this._walletApiClient.account.request(params)
    this._windowMessageTransport.disconnect()
    this.account = _account
    return this.account
  }

  getAccountId(): string {
    if (!this.account || !this.account.id) {
      throw new Error(
        "Account not found. Please use `requestAccount` method first."
      )
    }
    return this.account.id
  }

  async getAddress(): Promise<string> {
    if (!this.account || !this.account.address) {
      throw new Error(
        "Account not found. Please use `requestAccount` method first."
      )
    }
    return this.account.address
  }

  async signMessage(message: string): Promise<string> {
    if (!this.account || !this.account.address) {
      throw new Error(
        "Account not found. Please use `requestAccount` method first."
      )
    }
    this._windowMessageTransport.connect()
    const buffer = await this._walletApiClient.message.sign(
      this.account.id,
      Buffer.from(message)
    )
    this._windowMessageTransport.disconnect()
    return buffer.toString()
  }

  async signTransaction(
    transaction: ethers.providers.TransactionRequest
  ): Promise<string> {
    if (!this.account || !this.account.address) {
      throw new Error(
        "Account not found. Please use `requestAccount` method first."
      )
    }

    const { value, to, nonce, data, gasPrice, gasLimit } = transaction

    const ethereumTransaction: any = {
      family: "ethereum" as const,
      amount: value ? new BigNumber(value.toString()) : new BigNumber(0),
      recipient: to ? to : AddressZero,
    }

    if (nonce) ethereumTransaction.nonce = nonce
    if (data)
      ethereumTransaction.data = Buffer.from(
        Hex.from(data.toString()).toString(),
        "hex"
      )
    if (gasPrice)
      ethereumTransaction.gasPrice = new BigNumber(gasPrice.toString())
    if (gasLimit)
      ethereumTransaction.gasLimit = new BigNumber(gasLimit.toString())

    this._windowMessageTransport.connect()
    const buffer = await this._walletApiClient.transaction.sign(
      this.account.id,
      ethereumTransaction
    )
    this._windowMessageTransport.disconnect()
    return buffer.toString()
  }

  async sendTransaction(
    transaction: Deferrable<ethers.providers.TransactionRequest>
  ): Promise<ethers.providers.TransactionResponse> {
    if (!this.account || !this.account.address) {
      throw new Error(
        "Account not found. Please use `requestAccount` method first."
      )
    }

    const { value, to, nonce, data, gasPrice, gasLimit } = transaction

    const ethereumTransaction: any = {
      family: "ethereum" as const,
      amount: value ? new BigNumber(value.toString()) : new BigNumber(0),
      recipient: to ? to : AddressZero,
    }

    if (nonce) ethereumTransaction.nonce = nonce
    if (data)
      ethereumTransaction.data = Buffer.from(
        Hex.from(data.toString()).toString(),
        "hex"
      )
    if (gasPrice)
      ethereumTransaction.gasPrice = new BigNumber(gasPrice.toString())
    if (gasLimit)
      ethereumTransaction.gasLimit = new BigNumber(gasLimit.toString())

    this._windowMessageTransport.connect()
    const transactionHash =
      await this._walletApiClient.transaction.signAndBroadcast(
        this.account.id,
        ethereumTransaction
      )
    this._windowMessageTransport.disconnect()

    const transactionResponse = this.provider?.getTransaction(transactionHash)
    console.log("Transaction response: ", transactionResponse)

    if (!transactionResponse) {
      throw new Error("Transaction response not found!")
    }

    return transactionResponse
  }

  connect(provider: ethers.providers.Provider): Signer {
    return new LedgerLiveEthereumSigner(
      provider,
      this._windowMessageTransport,
      this._walletApiClient
    )
  }
}
