import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { EnvVariable } from "../enums"
import { LedgerLiveAppManager } from "../ledger-live-app-manager"
import { getEnvVariable } from "./getEnvVariable"
import { getDefaultThresholdLibProvider } from "./getThresholdLib"

export const getLedgerLiveAppManager = (provider?: Provider) => {
  return new LedgerLiveAppManager(provider || getDefaultThresholdLibProvider())
}

export const ledgerLiveAppManager = getLedgerLiveAppManager(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
