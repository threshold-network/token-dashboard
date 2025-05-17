# Token Dashboard SUI Integration Implementation

## Task ID: TD-SUI-01

**Task Level**: Level 2 (Simple Enhancement)
**Completion Date**: 2023-09-17
**Status**: Implementation Complete, Ready for Testing

## Task Description

Set up a local development environment for the token-dashboard with a linked tbtc-v2 SDK to test the SUI Network implementation. The integration enables Bitcoin deposits via the tBTC protocol with Wormhole bridging to the SUI Network.

## Implementation Summary

The implementation process involved setting up the tbtc-v2 SDK with SUI support, linking it to the token-dashboard, and configuring the necessary parameters for the SUI network integration using the Wormhole bridge. The application was successfully started in development mode and is ready for testing the cross-chain deposit functionality.

## Key Components Modified

1. **tbtc-v2 SDK**:

   - Added SUI network support in the Ethereum L1BitcoinDepositor
   - Created SuiBTCDepositorWormhole artifact for the Sepolia contract
   - Verified SUI was properly defined in DestinationChainName type

2. **token-dashboard**:
   - Linked to the local tbtc-v2 SDK with SUI support
   - Verified SUI wallet provider implementation
   - Confirmed Sepolia testnet configuration

## Implementation Process

### 1. SDK Setup and Configuration

```bash
# Clone and set up tbtc-v2
cd /Users/leonardosaturnino/Documents/GitHub/tbtc-v2
nvm use 18
yarn install

# Build the TypeScript SDK
cd typescript
yarn build
yarn link
```

### 2. SDK Modifications

- Created artifact for the BTCDepositorWormhole contract at `tbtc-v2/typescript/src/lib/ethereum/artifacts/sepolia/SuiBTCDepositorWormhole.json`
- Updated the L1BitcoinDepositor to include SUI chain support:
  ```typescript
  // In artifactLoader.getSepolia function
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

## Configuration Details

### Contract Addresses

- **BTCDepositorWormhole Proxy**: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95
- **Implementation Contract**: 0x75757a633237D7bb0c51b51952F171BE20C60056
- **ProxyAdmin**: 0x8E6C6f8e1551ba79D9ECe97fd584BbE7572cE79f
- **SUI Wormhole Gateway**: 0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7

### Network Configuration

- **Ethereum (L1)**: Sepolia Testnet (Chain ID: 11155111)
- **SUI (L2)**: Testnet
- **Wormhole Chain ID for SUI**: 21

## Technical Challenges

### 1. Node.js Version Compatibility

- **Challenge**: token-dashboard required Node.js v20, but tbtc-v2 SDK was built with v18
- **Solution**: Used NVM to switch Node versions between repositories

### 2. SDK Artifact Structure

- **Challenge**: Creating the correct structure for the SuiBTCDepositorWormhole artifact
- **Solution**: Examined existing artifacts and ensured the new one included all required fields, especially the receipt field needed by the EthersContractDeployment interface

### 3. Wormhole Configuration

- **Challenge**: Complex configuration requirements for Wormhole bridge
- **Solution**: Used the deployed contract addresses and chain IDs from the provided information

## Testing Instructions

1. **Connect to Sepolia Testnet**

   - Open the running application in your browser
   - Connect an Ethereum wallet (MetaMask, etc.)
   - Ensure the wallet is set to Sepolia testnet

2. **Test SUI Wallet Connection**

   - Install a SUI wallet extension (like Suiet or Sui Wallet)
   - Navigate to the tBTC application section
   - Connect your SUI wallet

3. **Verify Cross-Chain Deposit Flow**
   - Navigate to the tBTC deposit section
   - Check if SUI is available as a destination chain
   - Fill out the deposit form with SUI as the destination
   - Verify the UI correctly shows the Wormhole bridge path

## Next Steps and Recommendations

1. **Complete UI Testing**

   - Test the full deposit flow with SUI destination
   - Verify error handling and edge cases

2. **Documentation**

   - Update project documentation with SUI integration details
   - Create user guide for the SUI deposit process

3. **Potential Improvements**
   - Add better error handling for cross-chain transfers
   - Improve user feedback during the Wormhole bridging process
   - Add automated tests for the SUI integration

## Reference Links

- [tbtc-v2 Repository](https://github.com/keep-network/tbtc-v2)
- [token-dashboard Repository](https://github.com/threshold-network/token-dashboard)
- [Wormhole Documentation](https://docs.wormhole.com)
- [SUI Testnet](https://docs.sui.io/testnet)

## Conclusion

The implementation has successfully set up the local development environment for testing the SUI Network integration with the token-dashboard. The application is now ready for testing the cross-chain deposit functionality to SUI Network via the Wormhole bridge.
