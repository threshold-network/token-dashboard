import { LedgerLiveSigner } from "./ledger"
import { getThresholdLibProvider } from "./getThresholdLib"
import { getDefaultProviderChainId } from "./getEnvVariable"

export const getLedgerLiveAppEthereumSigner = (chainId?: number | string) => {
  const providerChainId = chainId || getDefaultProviderChainId()
  const provider = getThresholdLibProvider(providerChainId)
  return new LedgerLiveSigner(provider)
}
