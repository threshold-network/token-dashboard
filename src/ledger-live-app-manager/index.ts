import { EthereumManager } from "./ethereum"
import { Provider } from "@ethersproject/providers"

/**
 * Class that manages all transactions on LedgerLiveApp
 */
export class LedgerLiveAppManager {
  //TODO: Add bitcoinManager
  ethereumManager: EthereumManager

  constructor(provider: Provider) {
    this.ethereumManager = new EthereumManager(provider)
  }
}
