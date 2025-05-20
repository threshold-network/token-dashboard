🎨🎨🎨 ENTERING CREATIVE PHASE: SUI CONFIGURATION IMPROVEMENTS 🎨🎨🎨

# tBTC SUI Integration: Configuration Best Practices

## Current Configuration Analysis

After analyzing the SUI integration in both the tbtc-v2 SDK and token-dashboard implementation, we've identified several areas for improvement in the configuration management approach:

### Key Findings

1. **Missing Environment-Specific Configuration**:

   - Current implementation uses hardcoded values in `tbtc-v2/typescript/src/lib/sui/index.ts`
   - Placeholders like `0xPLACEHOLDER_SUI_DEPOSITOR_PACKAGE_ID` are used instead of real values
   - No clear mechanism to switch between testnet and mainnet

2. **Inconsistent Contract Address Management**:

   - SUI contract addresses not stored in artifact files like EVM chains
   - Lack of standardized approach for address management across chains

3. **Hardcoded RPC URL**:

   - SUI client creation uses a hardcoded testnet URL (`https://fullnode.testnet.sui.io:443`)
   - No configuration option to switch to mainnet

4. **Contract-Driven Chain IDs**:
   - After further analysis, we discovered that Wormhole chain IDs are defined in the L1 Bitcoin Depositor contract
   - The SUI chain ID (21) is already configured in the contract and doesn't need separate configuration in the SDK
   - This creates a single source of truth for chain IDs in the contract, avoiding redundancy

## Recommended Configuration Architecture

We propose an architecture that aligns with the following principles:

1. **UI-Driven Environment Selection**:

   - Environment decisions (testnet vs. mainnet) should come from the UI layer
   - SDK should be environment-agnostic but configurable

2. **Artifact-Based Contract References**:

   - Contract addresses/package IDs stored in artifact files
   - Include L1 Bitcoin Depositor contract addresses which contain chain IDs
   - Consistent with patterns used for EVM and Solana chains

3. **Flexible Client Configuration**:
   - RPC URLs configurable by the consuming application
   - Simple mechanism to create properly configured clients

### Implementation Recommendations

#### 1. Create SUI Network Artifacts

```typescript
// tbtc-v2/typescript/src/lib/sui/artifacts/testnet/index.ts
export const SuiTestnetArtifacts = {
  // This contract defines the Wormhole chain ID for SUI internally
  L1BitcoinDepositor: {
    address: "0xb306e0683f890BAFa669c158c7Ffa4b754b70C95", // SUI L1 Bitcoin Depositor on Sepolia
  },
  BitcoinDepositor: {
    packageId: "0x...", // Real testnet package ID
    wormholeGateway:
      "0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7",
  },
  TBTCToken: {
    packageId: "0x...", // Real testnet package ID
  },
}

// tbtc-v2/typescript/src/lib/sui/artifacts/mainnet/index.ts
export const SuiMainnetArtifacts = {
  // This contract defines the Wormhole chain ID for SUI internally
  L1BitcoinDepositor: {
    address: "0x...", // SUI L1 Bitcoin Depositor on Ethereum mainnet (when available)
  },
  BitcoinDepositor: {
    packageId: "0x...", // Real mainnet package ID when available
    wormholeGateway: "0x...", // Real mainnet gateway when available
  },
  TBTCToken: {
    packageId: "0x...", // Real mainnet package ID when available
  },
}

// Artifact loader
export function getSuiArtifacts(isTestnet: boolean = true) {
  return isTestnet ? SuiTestnetArtifacts : SuiMainnetArtifacts
}
```

#### 2. Update SUI Module to Accept Configuration

```typescript
// tbtc-v2/typescript/src/lib/sui/index.ts
import { DestinationChainInterfaces } from "../contracts"
import type { SuiClient } from "@mysten/sui/client"
import type { Signer } from "@mysten/sui/cryptography"
import { SuiBitcoinDepositor } from "./sui-bitcoin-depositor"
import { SuiTBTCToken } from "./sui-tbtc-token"
import { getSuiArtifacts } from "./artifacts"

export interface SuiNetworkConfig {
  depositorPackageId: string
  tbtcPackageId: string
  wormholeGateway: string
}

export function loadSuiDestinationChainContracts(
  suiClient: SuiClient,
  suiSigner: Signer,
  isTestnet: boolean = true
): DestinationChainInterfaces {
  // Get appropriate artifacts based on network
  const artifacts = getSuiArtifacts(isTestnet)

  const suiBitcoinDepositor = new SuiBitcoinDepositor(
    suiClient,
    artifacts.BitcoinDepositor.packageId,
    suiSigner
  )

  const suiTbtcToken = new SuiTBTCToken(
    suiClient,
    artifacts.TBTCToken.packageId,
    `${artifacts.TBTCToken.packageId}::tbtc::TBTC`
  )

  return {
    destinationChainBitcoinDepositor: suiBitcoinDepositor,
    destinationChainTbtcToken: suiTbtcToken,
  }
}
```

#### 3. Configure SDK Initialization

```typescript
// In tbtc-v2/typescript/src/services/tbtc.ts
// Within initializeCrossChain method
if (destinationChainName === "Sui") {
  if (!suiClient) {
    throw new Error("SUI client is not defined")
  }

  // Determine if we're using testnet based on the Ethereum network
  const isTestnet = ethereumChainId !== 1 // Not mainnet Ethereum

  // Get artifacts including L1BitcoinDepositor address
  const artifacts = getSuiArtifacts(isTestnet)

  // The L1BitcoinDepositor contract knows the correct Wormhole chain ID for SUI
  // No need to configure it separately in the SDK
  const l1BitcoinDepositor = new ethers.Contract(
    artifacts.L1BitcoinDepositor.address,
    L1BitcoinDepositorABI,
    ethereumSigner
  )

  // Initialize SUI-specific components
  this.suiCrossChainContracts = loadSuiDestinationChainContracts(
    suiClient,
    suiSigner || undefined,
    isTestnet
  )
}
```

#### 4. Token Dashboard RPC URL Configuration

```typescript
// token-dashboard/.env
REACT_APP_SUI_NETWORK=testnet
REACT_APP_SUI_TESTNET_RPC_URL=https://fullnode.testnet.sui.io:443
REACT_APP_SUI_MAINNET_RPC_URL=https://fullnode.mainnet.sui.io:443
```

```typescript
// token-dashboard/src/threshold-ts/tbtc/index.ts
// In _initiateCrossChain method
if (destinationChainName === "Sui") {
  // Determine if we're using testnet or mainnet based on the Ethereum connection
  const isTestnet = shouldUseSuiTestnet(Number(connectedChainId))

  // Get network configuration
  const networkConfig = getSuiNetworkConfig(isTestnet ? "testnet" : "mainnet")

  // Create SUI client with the configured RPC URL
  const suiClient = new SuiClient({
    url: networkConfig.rpcUrl,
  })

  // Use the client in SDK initialization
  // ...
}
```

## Benefits

1. **Consistent Cross-Chain Architecture**:

   - Follows same patterns used for EVM chains and Solana
   - Contract addresses managed in artifact files

2. **Single Source of Truth for Chain IDs**:

   - Wormhole chain IDs defined only in the L1 Bitcoin Depositor contract
   - Eliminates redundancy and potential inconsistencies
   - SDK uses the contract's chain ID definition

3. **Environment Flexibility**:

   - Easy switching between testnet and mainnet
   - UI-driven environment selection

4. **Clear Separation of Concerns**:

   - SDK provides functionality without environment assumptions
   - UI controls which environment to use

5. **Future Maintainability**:
   - Adding mainnet support requires only new artifacts, not code changes
   - New contract integrations follow same pattern

## Implementation Checklist

1. [ ] Create SUI artifact structure for testnet and mainnet
2. [ ] Include L1BitcoinDepositor contract address in artifacts
3. [ ] Update SUI module to accept configuration objects
4. [ ] Modify SDK initialization to use artifacts based on environment
5. [ ] Update token-dashboard to provide appropriate RPC URLs
6. [ ] Test environment switching to ensure functionality

## Conclusion

This configuration approach provides a clear, maintainable structure for the SUI integration that aligns with existing patterns for other blockchain networks. By storing contract addresses in artifact files and relying on the L1 Bitcoin Depositor contract for chain IDs, we achieve a flexible, configurable system that avoids redundancy and ensures consistency between contract and SDK operations.

🎨🎨🎨 EXITING CREATIVE PHASE 🎨🎨🎨
