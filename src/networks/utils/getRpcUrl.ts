import { EnvVariable } from "../../enums"
import {
  getDefaultProviderChainId,
  getEnvVariable,
} from "../../utils/getEnvVariable"
import { networksAlchemyConfig } from "./networksAlchemyConfig"

const MAIN_ALCHEMY_URL = "g.alchemy.com/v2/"

export const getRpcUrl = (chainId?: number | string) => {
  const alchemyApiKey = getEnvVariable(EnvVariable.ALCHEMY_API_KEY)
  const defaultChainId = getDefaultProviderChainId()
  const chainIdNum = Number(chainId) || defaultChainId
  const alchemyConfig = networksAlchemyConfig[chainIdNum]

  return alchemyConfig?.name
    ? `https://${alchemyConfig.name}-${alchemyConfig.type}.${MAIN_ALCHEMY_URL}${alchemyApiKey}`
    : `http://localhost:8545`
}
