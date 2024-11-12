import { EnvVariable, EnvVariableKey } from "../enums"

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
  const chainIdInString = getEnvVariable(EnvVariable.DEFAULT_PROVIDER_CHAIN_ID)
  return Number(chainIdInString)
}

export const shouldUseTestnetDevelopmentContracts =
  getEnvVariable(EnvVariable.DAPP_DEVELOPMENT_TESTNET_CONTRACTS) === "true"
