# SUI Configuration Implementation

This document describes the implementation of the SUI configuration system for the tBTC integration.

## Overview

The SUI configuration system follows these key principles:

1. **UI-Driven Environment Selection**: The token-dashboard controls which environment (testnet/mainnet) to use
2. **Artifact-Based Contract References**: Contract addresses stored in artifact files
3. **Flexible Client Configuration**: RPC URLs configurable by the consuming application
4. **Contract-Driven Chain IDs**: Wormhole chain IDs defined in the L1 Bitcoin Depositor contract

## Implementation Details

### 1. Environment Variables

Added to `.env` and `.env.example`:

```
# SUI Configuration
REACT_APP_SUI_NETWORK=testnet
REACT_APP_SUI_TESTNET_RPC_URL=https://fullnode.testnet.sui.io:443
REACT_APP_SUI_MAINNET_RPC_URL=https://fullnode.mainnet.sui.io:443
```

### 2. Token Dashboard Configuration

Created a configuration file at `src/config/sui.ts` which:

- Defines a `SuiNetworkConfig` interface for SUI-specific settings
- Provides default configurations for testnet and mainnet
- Exports helper functions for determining network settings
- Focuses on RPC URLs and client configuration (not chain IDs)

### 3. SDK Integration

Updated `src/threshold-ts/tbtc/index.ts` to:

- Import the SUI configuration functions
- Use `shouldUseSuiTestnet()` to determine network based on Ethereum connection
- Create SUI client with the appropriate RPC URL from configuration
- Prepare for future enhancements to support both testnet and mainnet

### 4. SDK Reference Implementation

Created a template at `templates/sui-artifacts-reference.ts` showing how the tbtc-v2 SDK should be modified to:

- Use artifact files for storing contract addresses, including L1BitcoinDepositor
- Rely on the L1BitcoinDepositor contract for Wormhole chain IDs
- Support environment-specific configurations
- Provide a flexible, maintainable architecture

## Contract-Driven Chain IDs

A key insight in this implementation is that **Wormhole chain IDs are defined in the L1 Bitcoin Depositor contract** and do not need to be separately configured in the SDK:

1. The L1 Bitcoin Depositor contract (`SuiBTCDepositorWormhole`) contains the destination chain ID for SUI
2. When calling `finalizeDeposit()`, the contract uses this chain ID for Wormhole transfers
3. This creates a single source of truth for chain IDs in the contract, not the SDK
4. The SDK only needs to know the correct L1 Bitcoin Depositor contract address

This approach eliminates redundancy and ensures consistency between contract and SDK operations.

## Usage

With this configuration in place:

1. The environment is determined based on:

   - The connected Ethereum network (testnet Ethereum = testnet SUI)
   - The `REACT_APP_SUI_NETWORK` environment variable

2. Contract addresses and RPC URLs are retrieved from the appropriate configuration

3. SUI client is created with the correct RPC URL for the environment

4. The token-dashboard will work with both testnet and mainnet without code changes

## Future Enhancements

1. **Real Contract Addresses**: Update with real L1 Bitcoin Depositor contract addresses for both environments

2. **Package IDs**: Update the placeholder SUI package IDs with real values when available

3. **SDK Implementation**: Implement the reference architecture in the tbtc-v2 SDK

4. **Testing**: Add comprehensive tests for the configuration system
