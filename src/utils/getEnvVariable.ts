import { EnvVariable, EnvVariableKey } from "../enums"
import { SupportedChainIds, TestnetChainIds } from "../networks/enums/networks"

type EnvMap = { [key in EnvVariableKey]: string }

const envMap: EnvMap = (
  Object.keys(EnvVariable) as Array<EnvVariableKey>
).reduce((reducer, key) => {
  reducer[key] = process.env[`REACT_APP_${EnvVariable[key]}`] as string
  return reducer
}, {} as EnvMap)

export const getEnvVariable = (envVar: EnvVariableKey) => {
  return envMap[envVar]
}

export const getDefaultProviderChainId = () => {
  const chainIdFromEnv = getEnvVariable(EnvVariable.DEFAULT_PROVIDER_CHAIN_ID)

  if (!chainIdFromEnv) {
    return SupportedChainIds.Ethereum
  }

  const chainId = Number(chainIdFromEnv)

  // If chainIdFromEnv is not a valid number, also default to Ethereum
  if (isNaN(chainId)) {
    return SupportedChainIds.Ethereum
  }

  // If it's one of the known testnet chain IDs, return Sepolia
  if (Object.values(TestnetChainIds).includes(chainId)) {
    return SupportedChainIds.Sepolia
  }

  // Otherwise, return the chain ID from the environment
  return chainId
}

export const shouldUseTestnetDevelopmentContracts =
  getEnvVariable(EnvVariable.DAPP_DEVELOPMENT_TESTNET_CONTRACTS) === "true"
