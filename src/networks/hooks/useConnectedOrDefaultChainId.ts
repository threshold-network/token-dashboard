import { useIsActive } from "../../hooks/useIsActive"
import { getDefaultProviderChainId } from "../../utils/getEnvVariable"

export const useConnectedOrDefaultChainId = () => {
  const { chainId } = useIsActive()
  const defaultOrConnectedChainId = chainId ?? getDefaultProviderChainId()

  return defaultOrConnectedChainId
}
