import {
  InjectedConnector,
  NoEthereumProviderError,
} from "@web3-react/injected-connector"
import { ConnectorUpdate } from "@web3-react/types"

declare global {
  interface Window {
    ethereum: MetaMaskProvider
  }
}

interface MetaMaskProvider {
  /**
   * MetaMask exposes some experimental, MetaMask-specific methods under the
   * `ethereum._metamask` property. Can be used to determine if the provider is
   * actually a MetaMask.
   */
  _metamask: unknown
  /**
   * This property is non-standard. Non-MetaMask providers may also set this
   * property to true.
   */
  isMetaMask: boolean
  /**
   * Some wallet extensions overide the `window.ethereum` and add
   * `providers` array. We must find the MetaMask provider in this array to use
   * MetaMask provider not another wallet provider.
   */
  providers?: MetaMaskProvider[]
}

export class InjectedProviderIsNotMetaMaskError extends Error {
  constructor() {
    super("Injected Provider is not a MetaMask. Try again.")
  }
}

class MetaMask extends InjectedConnector {
  private isMetaMask(provider: unknown): boolean {
    return (
      typeof provider === "object" &&
      provider !== null &&
      "_metamask" in provider &&
      "isMetaMask" in provider &&
      (provider as MetaMaskProvider).isMetaMask === true
    )
  }

  async activate(): Promise<ConnectorUpdate<string | number>> {
    const provider = (await this.getProvider()) as MetaMaskProvider

    if (!provider) {
      throw new NoEthereumProviderError()
    }

    if (!this.isMetaMask(provider)) {
      throw new InjectedProviderIsNotMetaMaskError()
    }

    // Handle the case when MetaMask and Coinbase Wallet are both installed.
    if (provider.providers?.length) {
      window.ethereum =
        provider.providers.find((p) => p.isMetaMask) ?? provider.providers[0]
    }

    return await super.activate()
  }
}

export const metamask = new MetaMask({})
