import { AbstractConnector } from "@web3-react/abstract-connector"
import { AbstractConnectorArguments, ConnectorUpdate } from "@web3-react/types"
import { getEnvVariable } from "../../utils/getEnvVariable"
import {
  LedgerConnectKit,
  SupportedProviders,
  loadConnectKit,
  EthereumProvider,
} from "@ledgerhq/connect-kit-loader"
import { EnvVariable } from "../../enums"
import { networks, supportedNetworksMap } from "../../networks/utils"
import { EthereumRpcMap } from "../../networks/types/networks"
import { getNetworkNameFromChainId } from "../../networks/utils/getNetworkNameFromChainId"
import { getRpcEndpointUrl } from "../../networks/utils/getRpcEndpointUrl"

const supportedNetworks = Object.keys(supportedNetworksMap).map(Number)

interface LedgerLiveConnectorArguments extends AbstractConnectorArguments {
  rpc: {
    [chainId: number]: string
  }
  walletConnectProjectId: string
}

export class LedgerLiveConnector extends AbstractConnector {
  private rpc: LedgerLiveConnectorArguments["rpc"]
  private provider?: EthereumProvider
  private connectKitPromise: Promise<LedgerConnectKit>
  private walletConnectProjectId: string

  constructor({
    supportedChainIds,
    rpc,
    walletConnectProjectId,
  }: Required<LedgerLiveConnectorArguments>) {
    super({ supportedChainIds })

    this.rpc = rpc
    this.walletConnectProjectId = walletConnectProjectId

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

  public async switchNetwork(chainId: string | number): Promise<void> {
    this.handleChainChanged(chainId.toString())
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.supportedChainIds) {
      throw new Error("Supported chain ids are not defined.")
    }
    // Removes all local storage entries that starts with "wc@2"
    // This is a workaround for "Cannot convert undefined or null to object"
    // error that sometime occur with WalletConnect
    Object.keys(localStorage)
      .filter((x) => x.startsWith("wc@2"))
      .forEach((x) => localStorage.removeItem(x))
    let account = ""
    const connectKit = await this.connectKitPromise
    const chainId = this.supportedChainIds[0]
    const checkSupportResult = connectKit.checkSupport({
      chains: [chainId],
      walletConnectVersion: 2,
      projectId: this.walletConnectProjectId,
      providerType: SupportedProviders.Ethereum,
      rpcMap: this.rpc,
    })

    if (!checkSupportResult.isChainIdSupported) {
      throw new Error(
        `The ${getNetworkNameFromChainId(
          chainId
        )} network is not supported by LedgerLive.`
      )
    }

    this.provider = (await connectKit.getProvider()) as EthereumProvider

    this.provider.on("networkChanged", this.handleNetworkChanged)
    this.provider.on("chainChanged", this.handleChainChanged)
    this.provider.on("accountsChanged", this.handleAccountsChanged)
    this.provider.on("close", this.handleClose)

    const accounts = (await this.provider.request({
      method: "eth_requestAccounts",
    })) as string[]
    account = accounts[0]

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

export const ledgerLive = new LedgerLiveConnector({
  supportedChainIds: supportedNetworks,
  rpc: networks.reduce((acc, network) => {
    acc[network.chainId] = getRpcEndpointUrl(network.chainId)
    return acc
  }, {} as EthereumRpcMap),
  walletConnectProjectId: getEnvVariable(EnvVariable.WALLET_CONNECT_PROJECT_ID),
})

class ConnectorNotAcivatedError extends Error {
  constructor() {
    super("Connector not activated!")
  }
}
