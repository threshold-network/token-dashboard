import WalletConnectProvider from "@walletconnect/ethereum-provider"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { ConnectorUpdate } from "@web3-react/types"
import { EnvVariable } from "../../enums"
import { getEnvVariable, supportedChainId } from "../../utils/getEnvVariable"

export interface EthereumRpcMap {
  [chainId: string]: string
}

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

function getSupportedChains({ chains, rpc }: WalletConnectOptions): number[] {
  if (chains) {
    return chains
  }

  return rpc ? Object.keys(rpc).map((k) => Number(k)) : []
}

/**
 * Connector for WalletConnect V2
 */
export class WalletConnectConnector extends AbstractConnector {
  public provider?: WalletConnectProvider
  private readonly config: WalletConnectOptions
  private rpcMap: EthereumRpcMap

  constructor(config: WalletConnectOptions) {
    super({ supportedChainIds: getSupportedChains(config) })
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
    if (newChainId !== `0x${chainId}`) this.deactivate()
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
    if (!this.provider) {
      this.provider = await WalletConnectProvider.init({
        projectId: this.config.projectId,
        chains: getSupportedChains(this.config),
        rpcMap: this.rpcMap,
        showQrModal: this.config.showQrModal,
      })
    }

    if (chainId !== this.provider.chainId) {
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

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)
const chainId = +supportedChainId
const walletConnectProjectId = getEnvVariable(
  EnvVariable.WALLET_CONNECT_PROJECT_ID
)

export const walletConnect = new WalletConnectConnector({
  chains: [chainId],
  rpc: {
    [Number(supportedChainId)]: rpcUrl as string,
  },
  projectId: walletConnectProjectId,
  showQrModal: true,
})
