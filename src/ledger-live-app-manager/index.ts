import { LedgerLiveAppEthereumManager } from "./ethereum"
import { Provider } from "@ethersproject/providers"
import { LedgerLiveAppBitcoinManager } from "./bitcoin"

/**
 * Class that manages all transactions on LedgerLiveApp
 */
export class LedgerLiveAppManager {
  bitcoinManager: LedgerLiveAppBitcoinManager
  ethereumManager: LedgerLiveAppEthereumManager

  constructor(provider: Provider) {
    this.bitcoinManager = new LedgerLiveAppBitcoinManager()
    this.ethereumManager = new LedgerLiveAppEthereumManager(provider)
  }
}
