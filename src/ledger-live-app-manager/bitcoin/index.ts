import { getWalletAPIClient, getWindowMessageTransport } from "../wallet-api"
import {
  Account,
  WalletAPIClient,
  WindowMessageTransport,
} from "@ledgerhq/wallet-api-client"

export class LedgerLiveAppBitcoinManager {
  private _account: Account | undefined
  private _windowMessageTransport: WindowMessageTransport
  private _walletApiClient: WalletAPIClient

  constructor() {
    this._account = undefined
    this._windowMessageTransport = getWindowMessageTransport()
    this._walletApiClient = getWalletAPIClient(this._windowMessageTransport)
  }

  get account(): Account | undefined {
    return this._account
  }

  async connectAccount(
    params: { currencyIds?: string[] | undefined } | undefined
  ): Promise<Account> {
    this._windowMessageTransport.connect()
    const account = await this._walletApiClient.account.request(params)
    this._windowMessageTransport.disconnect()
    this._account = account
    return this._account
  }
}
