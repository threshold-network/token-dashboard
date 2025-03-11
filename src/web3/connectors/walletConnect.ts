import WalletConnectProvider from "@walletconnect/ethereum-provider"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { ConnectorUpdate } from "@web3-react/types"
import { EnvVariable } from "../../enums"
import { ArrayOneOrMore } from "../../types"
import { getEnvVariable } from "../../utils/getEnvVariable"
import {
  getRpcUrl,
  networks,
  supportedNetworks as supportedNetworksMap,
} from "../../networks/utils"
import { toHex } from "../../networks/utils/chainId"
import { EthereumRpcMap } from "../../networks/types/networks"
import { SupportedChainIds } from "../../networks/enums/networks"

const supportedNetworks = Object.keys(supportedNetworksMap).map(Number)

export type WalletConnectOptions = Omit<
  Parameters<typeof WalletConnectProvider.init>[0],
  "rpcMap"
> & {
  rpc: EthereumRpcMap
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = "The user rejected the request."
  }
}

/**
 * Connector for WalletConnect V2
 */
export class WalletConnectConnector extends AbstractConnector {
  public provider?: WalletConnectProvider
  private readonly config: WalletConnectOptions
  private rpcMap: EthereumRpcMap

  constructor(config: WalletConnectOptions) {
    super({ supportedChainIds: config.chains })
    this.config = config
    this.rpcMap = config.rpc

    this.handleOnConnect = this.handleOnConnect.bind(this)
    this.handleOnDisplayUri = this.handleOnDisplayUri.bind(this)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleOnConnect(): void {}

  private handleOnDisplayUri(): void {}

  private handleChainChanged(newChainId: number | string): void {
    this.emitUpdate({ chainId: newChainId })
    const newChainIdInHex = toHex(newChainId)
    if (!supportedNetworks.map(toHex).includes(newChainIdInHex))
      this.deactivate()
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts[0] })
  }

  private handleDisconnect(): void {
    // We have to do this because of a @walletconnect/web3-provider bug
    if (this.provider) {
      this.provider.removeListener("chainChanged", this.handleChainChanged)
      this.provider.removeListener(
        "accountsChanged",
        this.handleAccountsChanged
      )
      this.provider.removeListener("display_uri", this.handleOnDisplayUri)
      this.provider.removeListener("connect", this.handleOnConnect)
      this.provider = undefined
    }
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    // Removes all local storage entries that starts with "wc@2"
    // This is a workaround for "Cannot convert undefined or null to object"
    // error that sometime occur with WalletConnect
    Object.keys(localStorage)
      .filter((x) => x.startsWith("wc@2"))
      .forEach((x) => localStorage.removeItem(x))
    if (!this.provider) {
      const chains = this.config.chains
      if (chains?.length === 0) throw new Error("Chains not specified!")
      this.provider = await WalletConnectProvider.init({
        projectId: this.config.projectId,
        chains: chains as ArrayOneOrMore<number>,
        rpcMap: this.rpcMap,
        showQrModal: this.config.showQrModal,
        optionalChains: this.config.optionalChains,
      })
    }

    const providerChainIdInHex = toHex(this.provider.chainId)
    if (!supportedNetworks.map(toHex).includes(providerChainIdInHex)) {
      this.deactivate()
    }

    this.provider.on("connect", this.handleOnConnect)
    this.provider.on("display_uri", this.handleOnDisplayUri)

    const account = await new Promise<string>((resolve, reject) => {
      const userReject = () => {
        // Erase the provider manually
        this.provider = undefined
        reject(new UserRejectedRequestError())
      }

      // Workaround to bubble up the error when user reject the connection
      this.provider!.on("disconnect", () => {
        // Check provider has not been enabled to prevent this event callback
        // from being called in the future
        if (!account) {
          userReject()
        }
      })

      this.provider!.enable()
        .then((accounts: string[]) => resolve(accounts[0]))
        .catch((error: Error): void => {
          // TODO: ideally this would be a better check
          if (error.message === "User closed modal") {
            userReject()
            return
          }
          reject(error)
        })
    }).catch((err) => {
      console.log("Provider closed")
      this.emitError(err)
      throw err
    })

    this.provider.on("disconnect", this.handleDisconnect)
    this.provider.on("chainChanged", this.handleChainChanged)
    this.provider.on("accountsChanged", this.handleAccountsChanged)

    return { provider: this.provider, account }
  }

  public async getProvider(): Promise<any> {
    return this.provider
  }

  public async getChainId(): Promise<number | string> {
    return Promise.resolve(this.provider!.chainId)
  }

  public async getAccount(): Promise<null | string> {
    return Promise.resolve(this.provider!.accounts).then(
      (accounts: string[]): string => accounts[0]
    )
  }

  public deactivate() {
    if (this.provider) {
      this.provider.removeListener("disconnect", this.handleDisconnect)
      this.provider.removeListener("chainChanged", this.handleChainChanged)
      this.provider.removeListener(
        "accountsChanged",
        this.handleAccountsChanged
      )
      this.provider.removeListener("display_uri", this.handleOnDisplayUri)
      this.provider.removeListener("connect", this.handleOnConnect)
      this.provider.disconnect()
      this.provider = undefined
    }
  }

  public async close() {
    this.emitDeactivate()
  }
}

const walletConnectProjectId = getEnvVariable(
  EnvVariable.WALLET_CONNECT_PROJECT_ID
)

export const walletConnect = new WalletConnectConnector({
  chains: [SupportedChainIds.Ethereum],
  rpc: networks.reduce((acc, network) => {
    acc[network.chainId] = getRpcUrl(network.chainId)
    return acc
  }, {} as EthereumRpcMap),
  projectId: walletConnectProjectId,
  showQrModal: true,
  optionalChains: supportedNetworks.filter(
    (chainId) => chainId !== SupportedChainIds.Ethereum
  ),
})
