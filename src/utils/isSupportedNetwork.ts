import { getEnvVariable } from "./getEnvVariable"
import { EnvVariable } from "../enums"

const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

const isSupportedNetwork = (networkChainId?: number) => {
  return networkChainId === Number(supportedChainId)
}

export default isSupportedNetwork
