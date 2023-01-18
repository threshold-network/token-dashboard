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

export const supportedChainId = getEnvVariable(EnvVariable.SUPPORTED_CHAIN_ID)
