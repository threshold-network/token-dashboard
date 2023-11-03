import { JsonRpcProvider, Provider } from "@ethersproject/providers"
import { EnvVariable } from "../enums"
import { LedgerLiveAppEthereumSigner } from "../ledger-live-app-eth-signer"
import { getEnvVariable } from "./getEnvVariable"

export const getLedgerLiveAppEthereumSigner = (provider: Provider) => {
  return new LedgerLiveAppEthereumSigner(provider)
}

export const ledgerLiveAppEthereumSigner = getLedgerLiveAppEthereumSigner(
  new JsonRpcProvider(getEnvVariable(EnvVariable.ETH_HOSTNAME_HTTP))
)
