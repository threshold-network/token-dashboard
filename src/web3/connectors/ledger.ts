import { AbstractConnector } from "@web3-react/abstract-connector"
import AppEth from "@ledgerhq/hw-app-eth"
import {
  LEDGER_DERIVATION_PATHS,
  LedgerSubprovider,
} from "./ledger_subprovider"
// @ts-ignore
import CacheSubprovider from "web3-provider-engine/subproviders/cache.js"
// @ts-ignore
import WebsocketSubprovider from "web3-provider-engine/subproviders/websocket"
import TransportU2F from "@ledgerhq/hw-transport-u2f"
import Transport from "@ledgerhq/hw-transport-webhid"
import { Web3ProviderEngine } from "@0x/subproviders"
import { RPC_URL } from "../../config"

interface LedgerConstructionInterface {
  chainId?: string
  url?: string
  pollingInterval?: number
  requestTimeoutMs?: number
  accountFetchingConfigs?: any
  baseDerivationPath?: string
}

/**
 * Based on:
 * https://github.com/keep-network/tbtc-dapp/blob/49a9c186c7cef5d2a27fa9605e165914c7d12b07/src/connectors/ledger.js#L22
 *
 */
export class LedgerConnector extends AbstractConnector {
  defaultAccount = ""

  public chainId?: string
  public url?: string
  public pollingInterval?: number
  public requestTimeoutMs?: number
  public accountFetchingConfigs?: any
  public baseDerivationPath?: string
  public provider?: any

  constructor({
    chainId,
    url,
    pollingInterval,
    requestTimeoutMs,
    accountFetchingConfigs,
    baseDerivationPath,
  }: Partial<LedgerConstructionInterface>) {
    super({ supportedChainIds: [1] })

    this.chainId = chainId
    this.url = url
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
    this.accountFetchingConfigs = accountFetchingConfigs
    this.baseDerivationPath = baseDerivationPath
    // this.provider = provider
  }

  /**
   * @return {Promise<ConnectorUpdate>}
   */
  async activate() {
    if (!this.provider) {
      const ledgerEthereumClientFactoryAsync = async () => {
        let transport
        try {
          // attempt to create a transport instance using web-hid (chrome, brave)
          transport = await Transport.create()
        } catch (error: any) {
          // use U2F if web-hib is not supported (firefox)
          if (error?.message === "navigator.hid is not supported") {
            transport = await TransportU2F.create()
          } else {
            throw error
          }
        }

        // Ledger will automatically timeout the U2F "sign" request after `exchangeTimeout` ms.
        // The default is set at an annoyingly low threshold, of 10,000ms, wherein the connection breaks
        // and throws this cryptic error:
        //   `{name: "TransportError", message: "Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE", ...}`
        // Here we set it to 3hrs, to avoid this occurring, even if the user leaves the tab
        // open and comes back to it later.

        // @ts-ignore
        transport.setExchangeTimeout(10800000)
        // @ts-ignore
        const ledgerEthClient = new AppEth(transport)
        return ledgerEthClient
      }

      const engine = new Web3ProviderEngine({
        pollingInterval: this.pollingInterval,
      })

      engine.addProvider(
        new LedgerSubprovider({
          // @ts-ignore
          chainId: this.chainId as string,
          // @ts-ignore
          ledgerEthereumClientFactoryAsync,
          accountFetchingConfigs: this.accountFetchingConfigs,
          baseDerivationPath: this.baseDerivationPath,
        })
      )
      engine.addProvider(new CacheSubprovider())
      engine.addProvider(new WebsocketSubprovider({ rpcUrl: this.url }))
      this.provider = engine
    }

    this.provider.start()

    return { provider: this.provider, chainId: this.chainId }
  }

  /**
   * @return {Promise<Web3ProviderEngine>}
   */
  async getProvider() {
    return this.provider
  }

  /**
   * @return {Promise<number>}
   */
  async getChainId() {
    return this.chainId as string
  }

  async getAccount() {
    return this.defaultAccount
  }

  async getAccounts(numberOfAccounts = 5, accountsOffSet = 0) {
    return await this.provider._providers[0].getAccountsAsync(
      numberOfAccounts,
      accountsOffSet
    )
  }

  setDefaultAccount(account: string) {
    this.defaultAccount = account
  }

  deactivate() {
    this.provider.stop()
  }
}

export const ledgerLiveConnectorFactory = () =>
  new LedgerConnector({
    chainId: "1",
    url: RPC_URL[1],
    baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LIVE,
  })

export const ledgerLegacyConnectorFactory = () =>
  new LedgerConnector({
    chainId: "1",
    url: RPC_URL[1],
    baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LEGACY,
  })
