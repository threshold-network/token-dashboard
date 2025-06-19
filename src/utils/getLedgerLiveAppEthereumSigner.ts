import { LedgerLiveSigner } from "./ledger"
import { getThresholdLibProvider } from "./getThresholdLib"
import { getEthereumDefaultProviderChainId } from "./getEnvVariable"

export const getLedgerLiveAppEthereumSigner = (chainId?: number | string) => {
  const providerChainId = chainId || getEthereumDefaultProviderChainId()
  const provider = getThresholdLibProvider(providerChainId)
  return new LedgerLiveSigner(provider)
}
