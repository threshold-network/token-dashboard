import { EnvVariable } from "../enums/env"

const envMap: { [key in EnvVariable]: string } = {
  [EnvVariable.SupportedChainId]: process.env[
    "REACT_APP_SUPPORTED_CHAIN_ID"
  ] as string,
  [EnvVariable.RpcUrl]: process.env["REACT_APP_RPC_URL"] as string,
}

export const getEnvVariable = (envVar: EnvVariable) => {
  return envMap[envVar]
}
