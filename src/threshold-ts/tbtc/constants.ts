/**
 * Centralized API endpoints for tBTC services
 */

export const TBTC_API_ENDPOINTS = {
  MAINNET: {
    BASE_URL: "https://api.tbtcscan.com",
    GASLESS_REVEAL: "https://api.tbtcscan.com/api/gasless-reveal",
    RELAYER_REVEAL: "http://relayer.tbtcscan.com/api/reveal",
  },
  TESTNET: {
    BASE_URL: "http://localhost:3000",
    GASLESS_REVEAL: "http://localhost:3000/api/gasless-reveal",
    RELAYER_REVEAL: "http://localhost:3000/api/reveal",
  },
} as const

/**
 * Get the appropriate API endpoints based on network
 * @param {boolean} isTestnet Whether the network is testnet or mainnet
 * @return {object} API endpoints for the specified network
 */
export const getApiEndpoints = (isTestnet: boolean) => {
  return isTestnet ? TBTC_API_ENDPOINTS.TESTNET : TBTC_API_ENDPOINTS.MAINNET
}
