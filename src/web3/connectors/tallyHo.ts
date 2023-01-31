import { InjectedConnector } from "@web3-react/injected-connector"
import { ConnectorUpdate } from "@web3-react/types"

class TallyHo extends InjectedConnector {
  async isTallyHo(): Promise<boolean> {
    const provider = await this.getProvider()

    return provider?.isTally as boolean
  }

  async activate(): Promise<ConnectorUpdate<string | number>> {
    return await super.activate()
  }
}

const tallyHo = new TallyHo({})

export default tallyHo
