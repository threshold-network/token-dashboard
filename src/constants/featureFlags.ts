import { EnvVariable } from "../enums"
import { getEnvVariable } from "../utils/getEnvVariable"

export const TBTC_V2 =
  getEnvVariable(EnvVariable.FEATURE_FLAG_TBTC_V2) === "true"
export const MULTI_APP_STAKING =
  getEnvVariable(EnvVariable.FEATURE_FLAG_MULTI_APP_STAKING) === "true"
