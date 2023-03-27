import { InjectedConnector } from "@web3-react/injected-connector"
import { ConnectorUpdate } from "@web3-react/types"

declare global {
  interface Window {
    tally: TahoProvider
  }
}

interface TahoProvider {
  isTally: boolean
}

export class TahoNotInstalledError extends Error {
  constructor() {
    super("Taho not installed.")
  }
}

export class TahoIsNotDefaultWalletError extends Error {
  constructor() {
    super("Taho is not the default wallet.")
  }
}

class Taho extends InjectedConnector {
  private isTaho(provider: unknown): boolean {
    return (
      typeof provider === "object" &&
      provider !== null &&
      "request" in provider &&
      "isTally" in provider &&
      (provider as TahoProvider).isTally === true
    )
  }

  async activate(): Promise<ConnectorUpdate<string | number>> {
    if (!this.isTaho(window.tally)) {
      throw new TahoNotInstalledError()
    }

    const provider = await this.getProvider()

    if (!this.isTaho(provider)) {
      throw new TahoIsNotDefaultWalletError()
    }

    return await super.activate()
  }
}

export const taho = new Taho({})
