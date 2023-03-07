import { WalletLinkConnector } from "@web3-react/walletlink-connector"
import { ConnectorUpdate } from "@web3-react/types"
import { supportedChainId, getEnvVariable } from "../../utils/getEnvVariable"
import { EnvVariable } from "../../enums"

declare global {
  interface Window {
    ethereum: CoinbaseWalletProvider
  }
}

interface CoinbaseWalletProvider {
  isCoinbaseWallet: boolean
  overrideIsMetaMask: boolean
  updateProviderInfo(rpcUrl: string, chainId: number, fromRelay: boolean): void
  providers: CoinbaseWalletProvider[]
}

const rpcUrl = getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP)

class CoinbaseWalletConnector extends WalletLinkConnector {
  activate = async (): Promise<ConnectorUpdate<string | number>> => {
    // Handle the case when MetaMask and Coinbase Wallet are both installed.
    const provider =
      window.ethereum?.providers?.find((p) => p.isCoinbaseWallet) ??
      window.ethereum

    if (provider.isCoinbaseWallet) {
      // Force the Coinbase Wallet provider to use our RPC url. We can't fetch
      // past events from block range greater than `1000` when using the default
      // RPC url provided by Coinbase Wallet extension.
      // The `updateProviderInfo` is a private method(see
      // https://github.com/coinbase/coinbase-wallet-sdk/blob/v3.0.4/src/provider/CoinbaseWalletProvider.ts#L209)
      // in provider implementation but as we know private and protected are
      // only enforced during type checking. This means that JavaScript runtime
      // constructs like `in` or simple property lookup can still access a
      // `private` or `protected` member.
      provider.updateProviderInfo(rpcUrl, +supportedChainId, true)
    }

    return await super.activate()
  }
}

export const coinbaseConnector = new CoinbaseWalletConnector({
  url: rpcUrl,
  appName: "threshold-token-dashboard",
  supportedChainIds: [+supportedChainId],
})

export default coinbaseConnector
