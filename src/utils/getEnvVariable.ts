import { EnvVariable } from "../enums"

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
  [EnvVariable.FEATURE_FLAG_TBTC_V2]: process.env[
    "REACT_APP_FEATURE_FLAG_TBTC_V2"
  ] as string,
  [EnvVariable.FEATURE_FLAG_MULTI_APP_STAKING]: process.env[
    "REACT_APP_FEATURE_FLAG_MULTI_APP_STAKING"
  ] as string,
  [EnvVariable.FEATURE_FLAG_FEEDBACK_MODULE]: process.env[
    "REACT_APP_FEATURE_FLAG_FEEDBACK_MODULE"
  ] as string,
  [EnvVariable.FEATURE_FLAG_POSTHOG]: process.env[
    "REACT_APP_FEATURE_FLAG_POSTHOG"
  ] as string,
  [EnvVariable.POSTHOG_HOSTNAME_HTTP]: process.env[
    "REACT_APP_POSTHOG_HOSTNAME_HTTP"
  ] as string,
  [EnvVariable.POSTHOG_API_KEY]: process.env[
    "REACT_APP_POSTHOG_API_KEY"
  ] as string,
  [EnvVariable.THRESHOLD_MOCK_TBTC]: process.env[
    "REACT_APP_THRESHOLD_MOCK_TBTC"
  ] as string,
}

export const getEnvVariable = (envVar: EnvVariable) => {
  return envMap[envVar]
}

export const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)
