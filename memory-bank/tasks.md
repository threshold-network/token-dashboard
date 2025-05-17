# Token Dashboard SUI Integration Setup

## Task Overview

Set up token-dashboard with linked tbtc-v2 SDK for testing the SUI Network integration.

## Task ID

TD-SUI-01

## Task Status

Implementation Completed - Ready for User Testing
Creative Phase Completed for Dependency Conflict Resolution

## Task Complexity

Level 2 (Simple Enhancement)

## Implementation Plan

### Overview

This plan outlines the steps to set up a local development environment for the token-dashboard with a linked tbtc-v2 SDK to test the SUI Network implementation. The integration will enable Bitcoin deposits via the tBTC protocol with Wormhole bridging to the SUI Network.

### Files Modified

1. **tbtc-v2/typescript/src/lib/ethereum/l1-bitcoin-depositor.ts** - Updated with SUI support
2. **tbtc-v2/typescript/src/lib/ethereum/artifacts/sepolia/SuiBTCDepositorWormhole.json** - Created for SUI support
3. **token-dashboard/.env** - Verified Sepolia settings (already configured)
4. **token-dashboard/src/App.tsx** - Solana wallet provider commented out
5. **token-dashboard/src/hooks/useNonEVMConnection.ts** - Solana code disabled
6. **token-dashboard/src/components/Modal/SelectWalletModal/index.tsx** - Solana wallet option removed

## Task Checklist

### 1. tbtc-v2 Repository Setup

- [x] Navigate to the tbtc-v2 repository
- [x] Install dependencies with yarn
- [x] Build the TypeScript SDK
- [x] Set up yarn link for the SDK
- [x] Verify the SDK build works correctly

### 2. SDK Configuration

- [x] Check if the SDK's config has support for SUI network
- [x] Create SuiBTCDepositorWormhole artifact in the SDK
- [x] Configure Wormhole parameters for cross-chain communication
- [x] Ensure BTCDepositorWormhole contract is properly configured
- [x] Add SUI testnet configuration to the SDK

### 3. token-dashboard Setup

- [x] Link the local tbtc-v2 SDK to the token-dashboard
- [x] Install dependencies for token-dashboard
- [x] Start the application in development mode
- [x] Verify SUI wallet provider is loaded
- [x] Configure .env for Sepolia testnet (already configured)

### 4. Dependency Conflict Resolution

- [x] Analyze Solana dependency conflicts (Creative Phase)
- [x] Evaluate different resolution approaches (Creative Phase)
- [x] Select and implement the recommended approach (Option 2: Disable Solana)
- [x] Document the temporary solution

### 5. Test Integration

- [ ] Connect wallet to Sepolia network
- [ ] Attempt connection with SUI wallet
- [ ] Verify cross-chain deposit form shows SUI as option
- [ ] Test the deposit flow to SUI network
- [ ] Verify Wormhole bridging functionality

### 6. Documentation

- [x] Document issues encountered
- [x] Create notes on configuration requirements
- [x] Add troubleshooting steps
- [x] Document implementation process
- [x] Complete implementation documentation

## Implementation Details

### 1. Repository Setup and SDK Building

```bash
cd /Users/leonardosaturnino/Documents/GitHub/tbtc-v2
nvm use 18
yarn install
cd typescript
yarn build
yarn link
```

### 2. SDK Configuration

- Created SuiBTCDepositorWormhole.json artifact in tbtc-v2/typescript/src/lib/ethereum/artifacts/sepolia/ with:
  - Contract address: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95
  - ABI and receipt information
- Updated l1-bitcoin-depositor.ts to include SUI support:

  ```typescript
  import SepoliaSuiBTCDepositorWormhole from "./artifacts/sepolia/SuiBTCDepositorWormhole.json"

  // In the artifactLoader.getSepolia function:
  case "Sui":
    return SepoliaSuiBTCDepositorWormhole
  ```

### 3. token-dashboard Setup

```bash
cd /Users/leonardosaturnino/Documents/GitHub/token-dashboard
nvm use 20
yarn link "@keep-network/tbtc-v2.ts"
yarn install
yarn start
```

### 4. Dependency Conflict Resolution

After encountering dependency conflicts related to Solana packages, a creative phase was conducted to analyze different approaches. The selected solution was to disable Solana integration temporarily:

- Commented out SolanaWalletProvider in App.tsx
- Disabled Solana-related code in useNonEVMConnection.ts
- Removed Solana wallet option from SelectWalletModal/index.tsx
- Added clear comments indicating temporary nature of changes

### 5. Configuration Values Used

- BTCDepositorWormhole Proxy: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95
- Implementation: 0x75757a633237D7bb0c51b51952F171BE20C60056
- SUI Wormhole Gateway: 0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7
- Wormhole Chain ID for SUI: 21

## Development Notes

### 1. Dependency Issues

- The token-dashboard requires Node.js v20 for Solana dependencies
- Using NVM to switch between Node versions as needed
- tbtc-v2 SDK was built with Node.js v18
- Encountered error: `Attempted import error: 'addCodecSizePrefix' is not exported from '@solana/codecs'`
- Resolved by temporarily disabling Solana integration

### 2. SUI Integration Components

- SUIWalletProvider is already implemented in the token-dashboard
- The SUIWalletProvider context provides wallet connection functionality
- Need to test if the wallet detection works correctly

### 3. Wormhole Integration

- **Challenge**: Wormhole configuration complexity
- **Solution**: Used the contract addresses from the deployment information
- **Note**: Wormhole Chain ID for SUI is 21

### 4. Application Status

- The application has been successfully started in development mode
- Configured to use Sepolia testnet (REACT_APP_DEFAULT_PROVIDER_CHAIN_ID=11155111)
- Ready for testing the SUI wallet integration and cross-chain deposit functionality

## Testing Instructions

1. Test SUI wallet connection

   - Install a SUI wallet extension (like Suiet or Sui Wallet)
   - Navigate to the tBTC application section
   - Connect your SUI wallet

2. Test tBTC deposit with SUI destination

   - Navigate to the tBTC deposit section
   - Fill out the form selecting SUI as the destination
   - Verify the UI flow for cross-chain deposit

3. Document any issues or configuration changes needed
   - Note any errors or unexpected behavior
   - Document the UI flow and user experience

## Reference Information

- BTCDepositorWormhole Proxy: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95
- Implementation: 0x75757a633237D7bb0c51b51952F171BE20C60056
- ProxyAdmin: 0x8E6C6f8e1551ba79D9ECe97fd584BbE7572cE79f
- SUI Wormhole Gateway: 0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7
- Transaction Hash: 0xa3827be233644717178dc3e7571341638dcca779efa44a4fdba88b19bc9b7e24
- Sepolia Chain ID: 11155111
- Wormhole Chain ID for SUI: 21

## Conclusion

The implementation of the token-dashboard with the linked tbtc-v2 SDK for testing the SUI Network integration has been completed successfully. A creative phase was conducted to resolve dependency conflicts by temporarily disabling Solana integration. The application is now running with all necessary configurations and is ready for user testing.
