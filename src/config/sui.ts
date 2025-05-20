// Network configurations
export interface SuiNetworkConfig {
  rpcUrl: string
  name: string // Add network name for better identification
}

/**
 * Get SUI network configuration based on the environment
 * @param {string} network - Network name ("testnet" or "mainnet")
 * @return {SuiNetworkConfig} Network configuration
 */
export function getSuiNetworkConfig(
  network: string = process.env.REACT_APP_SUI_NETWORK || "testnet"
): SuiNetworkConfig {
  const isTestnet = network.toLowerCase() !== "mainnet"
  const networkName = isTestnet ? "testnet" : "mainnet"

  return {
    name: networkName,
    rpcUrl: isTestnet
      ? process.env.REACT_APP_SUI_TESTNET_RPC_URL ||
        "https://fullnode.testnet.sui.io:443"
      : process.env.REACT_APP_SUI_MAINNET_RPC_URL ||
        "https://fullnode.mainnet.sui.io:443",
  }
}

/**
 * Determine if we should use testnet based on Ethereum chain ID
 * @param {number} ethereumChainId - Connected Ethereum chain ID
 * @return {boolean} Boolean indicating if testnet should be used
 */
export function shouldUseSuiTestnet(ethereumChainId: number): boolean {
  // Use testnet if connected to any testnet or if REACT_APP_SUI_NETWORK is set to testnet
  return (
    ethereumChainId !== 1 || // Not Ethereum mainnet
    process.env.REACT_APP_SUI_NETWORK?.toLowerCase() === "testnet"
  )
}

/**
 * Get network name for logging and debugging
 * @param {boolean} isTestnet - Whether to use testnet
 * @return {string} "testnet" or "mainnet"
 */
export function getSuiNetworkName(isTestnet: boolean): string {
  return isTestnet ? "testnet" : "mainnet"
}
