import { useIsActive } from "../../hooks/useIsActive"
import { getDefaultProviderChainId } from "../../utils/getEnvVariable"

export const useDefaultOrConnectedChainId = () => {
  const { chainId } = useIsActive()
  const defaultOrConnectedChainId = chainId ?? getDefaultProviderChainId()

  return defaultOrConnectedChainId
}
