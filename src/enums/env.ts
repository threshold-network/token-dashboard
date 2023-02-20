const envVariables = [
  "SUPPORTED_CHAIN_ID",
  "ETH_HOSTNAME_HTTP",
  "ETH_HOSTNAME_WS",
  "FEATURE_FLAG_TBTC_V2",
  "FEATURE_FLAG_MULTI_APP_STAKING",
  "FEATURE_FLAG_POSTHOG",
  "FEATURE_FLAG_FEEDBACK_MODULE",
  "POSTHOG_HOSTNAME_HTTP",
  "POSTHOG_API_KEY",
  "ELECTRUM_PROTOCOL",
  "ELECTRUM_HOST",
  "ELECTRUM_PORT",
  "MOCK_BITCOIN_CLIENT",
  "FEATURE_FLAG_SENTRY",
  "SENTRY_DSN",
] as const

export type EnvVariableKey = typeof envVariables[number]

// In order not to break the previous enum API, so using eg.
// `EnvVariable.ETH_HOSTNAME_HTTP` is still valid.
export const EnvVariable: Record<EnvVariableKey, EnvVariableKey> =
  envVariables.reduce((reducer, envKey) => {
    reducer[envKey] = envKey
    return reducer
  }, {} as Record<EnvVariableKey, EnvVariableKey>)
