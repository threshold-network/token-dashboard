import WalletConnectProvider from "@walletconnect/ethereum-provider"
import { IWCEthRpcConnectionOptions, IRPCMap } from "@walletconnect/types"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { ConnectorUpdate } from "@web3-react/types"
import { EnvVariable } from "../../enums"
import { getEnvVariable, supportedChainId } from "../../utils/getEnvVariable"

export const URI_AVAILABLE = "URI_AVAILABLE"

export interface EthereumRpcMap {
  [chainId: string]: string
}

export interface WalletConnectConnectorArguments
  extends IWCEthRpcConnectionOptions {
  supportedChainIds?: number[]
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = "The user rejected the request."
  }
}

function getSupportedChains({
  supportedChainIds,
  rpc,
}: WalletConnectConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds
  }

  return rpc ? Object.keys(rpc).map((k) => Number(k)) : undefined
}

/**
 * Connector for WalletConnect V2
 */
export class WalletConnectConnector extends AbstractConnector {
  public provider?: WalletConnectProvider
  private readonly config: WalletConnectConnectorArguments
  private rpcMap: EthereumRpcMap

  constructor(config: WalletConnectConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) })
    this.config = config
    this.rpcMap = getRpcMap(config.rpc!)

    this.handleOnConnect = this.handleOnConnect.bind(this)
    this.handleOnDisplayUri = this.handleOnDisplayUri.bind(this)

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleOnConnect(): void {}

  private handleOnDisplayUri(): void {}

  private handleChainChanged(chainId: number | string): void {
    this.emitUpdate({ chainId })
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts[0] })
  }

  private handleDisconnect(): void {
    // we have to do this because of a @walletconnect/web3-provider bug
    if (this.provider) {
      this.provider.removeListener("chainChanged", this.handleChainChanged)
      this.provider.removeListener(
        "accountsChanged",
        this.handleAccountsChanged
      )
      this.provider = undefined
    }
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      this.provider = await WalletConnectProvider.init({
        projectId: "threshold-network-dashboard",
        chains: [chainId],
        rpcMap: this.rpcMap,
        showQrModal: true,
      })
    }

    this.provider.on("connect", this.handleOnConnect)
    this.provider.on("display_uri", this.handleOnDisplayUri)

    // ensure that the uri is going to be available, and emit an event if there's a new uri
    // if (!this.walletConnectProvider.connected) {
    //   await this.walletConnectProvider.connector.createSession(
    //     this.config.chainId ? { chainId: this.config.chainId } : undefined
    //   )
    //   this.emit(URI_AVAILABLE, this.walletConnectProvider.connector.uri)
    // }

    const account = await new Promise<string>((resolve, reject) => {
      const userReject = () => {
        // Erase the provider manually
        this.provider = undefined
        reject(new UserRejectedRequestError())
      }

      // Workaround to bubble up the error when user reject the connection
      this.provider!.on("disconnect", () => {
        // Check provider has not been enabled to prevent this event callback from being called in the future
        if (!account) {
          userReject()
        }
      })

      this.provider!.enable()
        .then((accounts: string[]) => resolve(accounts[0]))
        .catch((error: Error): void => {
          // TODO ideally this would be a better check
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
      this.provider.disconnect()
    }
  }

  public async close() {
    this.emitDeactivate()
  }
}

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const chainId = +supportedChainId

export const walletConnect = new WalletConnectConnector({
  supportedChainIds: [chainId],
  rpc: {
    [Number(supportedChainId)]: rpcUrl as string,
  },
})

function getRpcMap(rpc: IRPCMap): EthereumRpcMap {
  const rpcMap: EthereumRpcMap = {}

  for (const chainId in rpc) {
    if (rpc.hasOwnProperty(chainId)) {
      rpcMap[String(chainId)] = rpc[chainId]
    }
  }

  return rpcMap
}
