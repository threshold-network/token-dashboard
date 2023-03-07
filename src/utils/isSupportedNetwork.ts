import { supportedChainId } from "./getEnvVariable"

const isSupportedNetwork = (networkChainId?: number) => {
  return networkChainId === Number(supportedChainId)
}

export default isSupportedNetwork
