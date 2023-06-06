import { AbstractConnector } from "@web3-react/abstract-connector"
import { AbstractConnectorArguments, ConnectorUpdate } from "@web3-react/types"
import { getEnvVariable, supportedChainId } from "../../utils/getEnvVariable"
import {
  LedgerConnectKit,
  SupportedProviders,
  loadConnectKit,
  EthereumProvider,
} from "@ledgerhq/connect-kit-loader"
import { EnvVariable } from "../../enums"

interface LedgerLiveConnectorArguments extends AbstractConnectorArguments {
  rpc: {
    [chainId: number]: string
  }
}

export class LedgerLiveConnector extends AbstractConnector {
  private rpc: LedgerLiveConnectorArguments["rpc"]
  private provider?: EthereumProvider
  private connectKitPromise: Promise<LedgerConnectKit>

  constructor(args: Required<LedgerLiveConnectorArguments>) {
    super({
      supportedChainIds: Object.keys(args.rpc).map((chainId) =>
        Number(chainId)
      ),
    })

    this.rpc = args.rpc

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
      const chainId = Number(Object.keys(this.rpc)[0])
      const checkSupportResult = connectKit.checkSupport({
        chainId: chainId,
        providerType: SupportedProviders.Ethereum,
        rpc: this.rpc,
      })

      this.provider = (await connectKit.getProvider()) as EthereumProvider

      this.provider.on("networkChanged", this.handleNetworkChanged)
      this.provider.on("chainChanged", this.handleChainChanged)
      this.provider.on("accountsChanged", this.handleAccountsChanged)
      this.provider.on("close", this.handleClose)

      const accounts = (await this.provider.request({
        method: "eth_requestAccounts",
      })) as string[]
      account = accounts[0]
    } catch (err) {
      console.error("Error: ", err)
    }

    return { provider: this.provider, account }
  }

  public async getProvider(): Promise<EthereumProvider | undefined> {
    return this.provider
  }

  public async getChainId(): Promise<number> {
    if (!this.provider) throw new ConnectorNotAcivatedError()

    return this.provider.request({ method: "eth_chainId" })
  }

  public async getAccount(): Promise<string> {
    if (!this.provider) throw new ConnectorNotAcivatedError()

    const accounts = (await this.provider.request({
      method: "eth_requestAccounts",
    })) as string[]
    return accounts[0]
  }

  public deactivate() {
    if (!this.provider) throw new ConnectorNotAcivatedError()

    this.provider.removeListener("networkChanged", this.handleNetworkChanged)
    this.provider.removeListener("chainChanged", this.handleChainChanged)
    this.provider.removeListener("accountsChanged", this.handleAccountsChanged)
    this.provider.removeListener("close", this.handleClose)
  }
}

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const chainId = +supportedChainId

export const ledgerLive = new LedgerLiveConnector({
  supportedChainIds: [chainId],
  rpc: {
    [Number(supportedChainId)]: rpcUrl as string,
  },
})

class ConnectorNotAcivatedError extends Error {
  constructor() {
    super("Connector not activated!")
  }
}
