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
import { ChainID } from "../../types"
// import TransportU2F from "@ledgerhq/hw-transport-u2f"
import Transport from "@ledgerhq/hw-transport-webhid"
import { Web3ProviderEngine } from "@0x/subproviders"

interface LedgerContructionInterface {
  chainId?: ChainID
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

  public chainId?: ChainID
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
  }: Partial<LedgerContructionInterface>) {
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
    console.log("activating@! ", this.provider)
    if (!this.provider) {
      const ledgerEthereumClientFactoryAsync = async () => {
        const ledgerConnection = await Transport.create()
        // Ledger will automatically timeout the U2F "sign" request after `exchangeTimeout` ms.
        // The default is set at an annoyingly low threshold, of 10,000ms, wherein the connection breaks
        // and throws this cryptic error:
        //   `{name: "TransportError", message: "Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE", ...}`
        // Here we set it to 3hrs, to avoid this occurring, even if the user leaves the tab
        // open and comes back to it later.
        ledgerConnection.setExchangeTimeout(10800000)
        // @ts-ignore
        const ledgerEthClient = new AppEth(ledgerConnection)
        return ledgerEthClient
      }

      console.log("got the factory set up ")

      const engine = new Web3ProviderEngine({
        pollingInterval: this.pollingInterval,
      })

      console.log("and the engine ", engine)

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
      console.log("added the ledher subprovider")
      engine.addProvider(new CacheSubprovider())
      console.log("added a cahce provider")
      engine.addProvider(new WebsocketSubprovider({ rpcUrl: this.url }))
      console.log("added a wensocket provider")
      this.provider = engine
    }

    console.log("starging the provider")
    try {
      this.provider.start()
    } catch (e) {
      console.log("failed to start ", e)
    }
    console.log("finished, returning out ", {
      provider: this.provider,
      chainId: this.chainId,
    })
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
    return this.chainId as ChainID
  }

  async getAccount() {
    return this.defaultAccount
  }

  async getAccounts(numberOfAccounts = 5, accountsOffSet = 0) {
    console.log("YO Y OY OY OY OY O")
    console.log(this.provider)
    console.log(this.provider._providers[0])
    console.log(
      "get accounts: ",
      await this.provider._providers[0].getAccountsAsync(
        numberOfAccounts,
        accountsOffSet
      )
    )
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

// TODO: These connectors need to be hooked up to the config and the radio buttons in the wallet modal
export const ledgerLiveConnector = new LedgerConnector({
  chainId: 1,
  // url: "wss://mainnet.infura.io/ws/v3/33593948cb074eea8e65ae716fc61afd",
  url: "wss://mainnet.infura.io/ws/v3/33593948cb074eea8e65ae716fc61afd",
  baseDerivationPath: "m'/44'/60'/0'/0", // LEDGER_DERIVATION_PATHS.LEDGER_LIVE,
})

export const ledgerLegacyConnector = new LedgerConnector({
  chainId: 1,
  // url: "wss://mainnet.infura.io/ws/v3/33593948cb074eea8e65ae716fc61afd",
  url: "wss://mainnet.infura.io/ws/v3/33593948cb074eea8e65ae716fc61afd",
  baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LEGACY,
})
