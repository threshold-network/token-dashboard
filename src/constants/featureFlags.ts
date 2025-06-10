import { EnvVariable } from "../enums"
import { getEnvVariable } from "../utils/getEnvVariable"

export const TBTC_V2 =
  getEnvVariable(EnvVariable.FEATURE_FLAG_TBTC_V2) === "true"

export const MULTI_APP_STAKING =
  getEnvVariable(EnvVariable.FEATURE_FLAG_MULTI_APP_STAKING) === "true"

export const POSTHOG =
  getEnvVariable(EnvVariable.FEATURE_FLAG_POSTHOG) === "true" &&
  !window.location.href.includes("dashboard.test")

export const TRM = getEnvVariable(EnvVariable.FEATURE_FLAG_TRM) === "true"

export const FEEDBACK_MODULE =
  getEnvVariable(EnvVariable.FEATURE_FLAG_FEEDBACK_MODULE) === "true"

export const SENTRY = getEnvVariable(EnvVariable.FEATURE_FLAG_SENTRY) === "true"

export const TBTC_V2_REDEMPTION =
  getEnvVariable(EnvVariable.FEATURE_FLAG_TBTC_V2_REDEMPTION) === "true"

export const LEDGER_LIVE =
  getEnvVariable(EnvVariable.FEATURE_FLAG_LEDGER_LIVE) === "true"

export const GOOGLE_TAG_MANAGER =
  getEnvVariable(EnvVariable.FEATURE_FLAG_GOOGLE_TAG_MANAGER) === "true"
