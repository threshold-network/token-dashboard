import { EnvVariable } from "../enums"

console.log("PROCESS B - ", process)

const envMap: { [key in EnvVariable]: string } = {
  [EnvVariable.SupportedChainId]: process.env[
    "REACT_APP_SUPPORTED_CHAIN_ID"
  ] as string,
  [EnvVariable.ETH_HOSTNAME_HTTP]: process.env[
    "REACT_APP_ETH_HOSTNAME_HTTP"
  ] as string,
  [EnvVariable.ETH_HOSTNAME_WS]: process.env[
    "REACT_APP_ETH_HOSTNAME_WS"
  ] as string,
}

export const getEnvVariable = (envVar: EnvVariable) => {
  return envMap[envVar]
}

export const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)
