/**
 * Feature flags for the Token Dashboard
 *
 * These flags allow features to be enabled/disabled via environment variables
 * without requiring code changes. This is especially useful for:
 * - Gradual rollouts
 * - Quick rollbacks if issues are found
 * - A/B testing
 * - Different configurations per environment
 */

export const FEATURES = {
  /**
   * StarkNet Integration
   * When enabled, allows users to create cross-chain deposits to StarkNet
   * Default: false (disabled)
   *
   * To enable: Set REACT_APP_ENABLE_STARKNET=true
   */
  STARKNET_ENABLED: process.env.REACT_APP_ENABLE_STARKNET === "true",
} as const

// Type-safe feature flag helper
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature]
}
