import { useIsActive } from "../../hooks/useIsActive"
import { getEthereumDefaultProviderChainId } from "../../utils/getEnvVariable"
import { isMainnetChainId } from "../utils"

export const useConnectedOrDefaultEthereumChainId = () => {
  const { chainId } = useIsActive()
  const defaultEthereumChainId = getEthereumDefaultProviderChainId()

  // If no chain is connected, use the default chain.
  if (!chainId) return defaultEthereumChainId

  const isActiveMainnet = isMainnetChainId(chainId)
  const isDefaultMainnet = isMainnetChainId(defaultEthereumChainId)

  // Return the connected chainId if it matches the default provider’s network type.
  return isActiveMainnet === isDefaultMainnet ? chainId : defaultEthereumChainId
}
