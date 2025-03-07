import { useIsActive } from "../../hooks/useIsActive"
import { getDefaultProviderChainId } from "../../utils/getEnvVariable"
import { isMainnetChainId } from "../utils"

export const useConnectedOrDefaultChainId = () => {
  const { chainId } = useIsActive()
  const defaultChainId = getDefaultProviderChainId()

  // If no chain is connected, use the default chain.
  if (!chainId) return defaultChainId

  const isActiveMainnet = isMainnetChainId(chainId)
  const isDefaultMainnet = isMainnetChainId(defaultChainId)

  // Return the connected chainId if it matches the default provider’s network type.
  return isActiveMainnet === isDefaultMainnet ? chainId : defaultChainId
}
