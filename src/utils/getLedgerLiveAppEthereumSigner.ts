import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { EnvVariable } from "../enums"
import { LedgerLiveEthereumSigner } from "@keep-network/tbtc-v2.ts"
import { getEnvVariable } from "./getEnvVariable"

export const getLedgerLiveAppEthereumSigner = (provider: Provider) => {
  return new LedgerLiveEthereumSigner(provider)
}

export const ledgerLiveAppEthereumSigner = getLedgerLiveAppEthereumSigner(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
