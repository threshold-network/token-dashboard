export enum FeatureFlag {
  TBTCV2 = "TBTCV2",
}

export type FeatureFlagObjectType = {
  isActive: boolean
}

export type FeatureFlagsType = {
  [key in FeatureFlag]: FeatureFlagObjectType
}

export const featureFlags: FeatureFlagsType = {
  [FeatureFlag.TBTCV2]: { isActive: false },
}
