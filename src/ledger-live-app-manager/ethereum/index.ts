import { LedgerLiveEthereumSigner } from "./signer"
import { Provider } from "@ethersproject/providers"
import { getWalletAPIClient, getWindowMessageTransport } from "../wallet-api"
import { Account } from "@ledgerhq/wallet-api-client"

export class EthereumManager {
  private _signer: LedgerLiveEthereumSigner

  constructor(provider: Provider) {
    const windowMessageTransport = getWindowMessageTransport()
    const walletApiClient = getWalletAPIClient(windowMessageTransport)
    this._signer = new LedgerLiveEthereumSigner(
      provider,
      windowMessageTransport,
      walletApiClient
    )
  }

  get signer(): LedgerLiveEthereumSigner {
    return this._signer
  }

  get account(): Account | undefined {
    return this._signer.account
  }

  connectAccount = async (
    params: { currencyIds?: string[] | undefined } | undefined
  ): Promise<Account> => {
    return await this._signer.requestAccount(params)
  }
}
