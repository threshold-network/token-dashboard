import Eth from "@ledgerhq/hw-app-eth"
import TransportWebUSB from "@ledgerhq/hw-transport-webusb"
import { AbstractConnector } from "@web3-react/abstract-connector"
import { ConnectorUpdate } from "@web3-react/types"
import Web3ProviderEngine from "web3-provider-engine"
// @ts-ignore
import CacheSubprovider from "web3-provider-engine/subproviders/cache.js"

import {
  LedgerSubprovider,
  LEDGER_DERIVATION_PATHS,
} from "./ledger_subprovider"
import {
  AccountFetchingConfigs,
  LedgerEthereumClient,
} from "@0x/subproviders/lib/src/types"
import { RPCSubprovider } from "@0x/subproviders/lib/src/subproviders/rpc_subprovider"
import { EnvVariable } from "../../enums"
import { supportedChainId, getEnvVariable } from "../../utils/getEnvVariable"

interface LedgerConnectorArguments {
  chainId: number
  url: string
  pollingInterval?: number
  requestTimeoutMs?: number
  accountFetchingConfigs?: any
  baseDerivationPath?: string
}

async function ledgerEthereumNodeJsClientFactoryAsync(): Promise<LedgerEthereumClient> {
  const ledgerConnection = await TransportWebUSB.create()
  const ledgerEthClient = new Eth(ledgerConnection)
  // @ts-ignore
  return ledgerEthClient
}

export class LedgerConnector extends AbstractConnector {
  private readonly chainId: number
  private readonly url: string
  private readonly pollingInterval?: number
  private readonly requestTimeoutMs?: number
  private readonly accountFetchingConfigs?: AccountFetchingConfigs
  private readonly baseDerivationPath?: string
  private provider!: Web3ProviderEngine

  public defaultAccount = ""

  constructor({
    chainId,
    url,
    pollingInterval,
    requestTimeoutMs,
    accountFetchingConfigs,
    baseDerivationPath,
  }: LedgerConnectorArguments) {
    super({ supportedChainIds: [chainId] })

    this.chainId = chainId
    this.url = url
    this.pollingInterval = pollingInterval
    this.requestTimeoutMs = requestTimeoutMs
    this.accountFetchingConfigs = accountFetchingConfigs
    this.baseDerivationPath = baseDerivationPath
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.provider) {
      const engine = new Web3ProviderEngine({
        pollingInterval: this.pollingInterval,
      })

      engine.addProvider(
        new LedgerSubprovider({
          networkId: this.chainId,
          ledgerEthereumClientFactoryAsync:
            ledgerEthereumNodeJsClientFactoryAsync,
          accountFetchingConfigs: this.accountFetchingConfigs,
          baseDerivationPath: this.baseDerivationPath,
          onDisconnect: this.emitDeactivate.bind(this),
        })
      )
      engine.addProvider(new CacheSubprovider())
      engine.addProvider(new RPCSubprovider(this.url, this.requestTimeoutMs))
      this.provider = engine
    }

    this.provider.start()

    return { provider: this.provider, chainId: this.chainId }
  }

  public async getProvider(): Promise<Web3ProviderEngine> {
    return this.provider
  }

  public async getChainId(): Promise<number> {
    return this.chainId
  }

  public async getAccount(): Promise<string> {
    return this.defaultAccount
  }

  public async getAccounts(
    numberOfAccounts = 10,
    accountsOffSet = 0
  ): Promise<string[]> {
    return (
      (this.provider as any)._providers[0] as LedgerSubprovider
    ).getAccountsAsync(numberOfAccounts, accountsOffSet)
  }

  public deactivate(): void {
    this.provider.stop()
  }

  public setDefaultAccount(account: string) {
    this.defaultAccount = account
  }
}

const chainId = +supportedChainId
const url = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)

export const ledgerLiveConnectorFactory = () => {
  return new LedgerConnector({
    chainId,
    url,
    baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LIVE,
  })
}

export const ledgerLegacyConnectorFactory = () =>
  new LedgerConnector({
    chainId,
    url,
    baseDerivationPath: LEDGER_DERIVATION_PATHS.LEDGER_LEGACY,
  })
