import { EnvVariable } from "../enums/env"

const envMap = {
  [EnvVariable.SupportedChainId]: process.env["REACT_APP_SUPPORTED_CHAIN_ID"],
  [EnvVariable.InfuraID]: process.env["REACT_APP_INFURA_ID"],
}

export const getEnvVariable = (envVar: EnvVariable) => {
  return envMap[envVar]
}
