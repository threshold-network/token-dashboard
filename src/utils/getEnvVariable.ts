import { EnvVariable } from "../enums/env"

const envMap = {
  [EnvVariable.SupportedChainId]: process.env["REACT_APP_SUPPORTED_CHAIN_ID"],
  [EnvVariable.RpcUrl]: process.env["REACT_APP_RPC_URL"],
}

export const getEnvVariable = (envVar: EnvVariable) => {
  console.log(process.env)
  console.log(envMap)
  return envMap[envVar]
}
