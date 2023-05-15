import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { AbstractConnectorArguments, ConnectorUpdate } from "@web3-react/types"
import { getEnvVariable, supportedChainId } from "../../utils/getEnvVariable"
import {
  LedgerConnectKit,
  SupportedProviders,
  loadConnectKit,
} from "@ledgerhq/connect-kit-loader"
import { EnvVariable } from "../../enums"

export class LedgerLiveConnector extends AbstractConnector {
  private provider?: any
  private connectKitPromise: Promise<LedgerConnectKit>

  constructor(args: Required<AbstractConnectorArguments>) {
    super(args)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)

    this.connectKitPromise = loadConnectKit()
  }

  private handleNetworkChanged(networkId: string): void {
    this.emitUpdate({ provider: this.provider, chainId: networkId })
  }

  private handleChainChanged(chainId: string): void {
    this.emitUpdate({ chainId })
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts.length === 0 ? null : accounts[0] })
  }

  private handleClose(): void {
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    let account = ""
    try {
      const connectKit = await this.connectKitPromise
      const checkSupportResult = connectKit.checkSupport({
        chainId: 1,
        providerType: SupportedProviders.Ethereum,
        rpc: {
          [Number(supportedChainId)]: rpcUrl as string,
        },
      })

      this.provider = await connectKit.getProvider()
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      })
      account = accounts[0]
    } catch (err) {
      console.log("Error: ", err)
    }

    return { provider: this.provider, account }
  }

  public async getProvider(): Promise<IFrameEthereumProvider | undefined> {
    return this.provider
  }

  public async getChainId(): Promise<number> {
    return this.provider!.request({ method: "eth_chainId" })
  }

  public async getAccount(): Promise<string> {
    return this.provider!.request({ method: "eth_accounts" }).then(
      (accounts: string[]): string => accounts[0]
    )
  }

  public deactivate() {
    this.provider = undefined
  }
}
const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const chainId = +supportedChainId

export const ledgerLive = new LedgerLiveConnector({
  supportedChainIds: [chainId],
})
