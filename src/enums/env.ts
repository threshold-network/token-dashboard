const envVariables = [
  "DEFAULT_PROVIDER_CHAIN_ID",
  "ALCHEMY_API_KEY",
  "TBTC_SUBGRAPH_API_KEY",
  "FEATURE_FLAG_TBTC_V2",
  "FEATURE_FLAG_TBTC_V2_REDEMPTION",
  "FEATURE_FLAG_MULTI_APP_STAKING",
  "FEATURE_FLAG_POSTHOG",
  "FEATURE_FLAG_FEEDBACK_MODULE",
  "FEATURE_FLAG_LEDGER_LIVE",
  "FEATURE_FLAG_TRM",
  "POSTHOG_HOSTNAME_HTTP",
  "POSTHOG_API_KEY",
  "ELECTRUM_PROTOCOL",
  "ELECTRUM_HOST",
  "ELECTRUM_PORT",
  "MOCK_BITCOIN_CLIENT",
  "FEATURE_FLAG_SENTRY",
  "SENTRY_DSN",
  "WALLET_CONNECT_PROJECT_ID",
  "DAPP_DEVELOPMENT_TESTNET_CONTRACTS",
  "FEATURE_FLAG_GOOGLE_TAG_MANAGER",
  "GOOGLE_TAG_MANAGER_ID",
] as const

export type EnvVariableKey = typeof envVariables[number]

// In order not to break the previous enum API, so using eg.
// `EnvVariable.ALCHEMY_API_KEY` is still valid.
export const EnvVariable: Record<EnvVariableKey, EnvVariableKey> =
  envVariables.reduce((reducer, envKey) => {
    reducer[envKey] = envKey
    return reducer
  }, {} as Record<EnvVariableKey, EnvVariableKey>)
