import { InjectedConnector } from "@web3-react/injected-connector"
import { ConnectorUpdate } from "@web3-react/types"

declare global {
  interface Window {
    tally: TallyProvider
  }
}

interface TallyProvider {
  isTally: boolean
}

export class TallyHoNotInstalledError extends Error {
  constructor() {
    super("TallyHo not installed.")
  }
}

export class TallyHoIsNotDefaultWalletError extends Error {
  constructor() {
    super("TallyHo is not the default wallet.")
  }
}

class TallyHo extends InjectedConnector {
  private isTally(provider: unknown): boolean {
    return (
      typeof provider === "object" &&
      provider !== null &&
      "request" in provider &&
      "isTally" in provider &&
      (provider as TallyProvider).isTally === true
    )
  }

  async activate(): Promise<ConnectorUpdate<string | number>> {
    if (!this.isTally(window.tally)) {
      throw new TallyHoNotInstalledError()
    }

    const provider = await this.getProvider()

    if (!this.isTally(provider)) {
      throw new TallyHoIsNotDefaultWalletError()
    }

    return await super.activate()
  }
}

export const tallyHo = new TallyHo({})
