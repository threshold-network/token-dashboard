# Technical Context

## Project Structure

- **token-dashboard**: React application for interacting with Threshold Network protocols
- **tbtc-v2**: Repository containing smart contracts and SDK for the tBTC protocol

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Chakra UI
- **State Management**: Redux (with @reduxjs/toolkit)
- **Blockchain Interaction**: ethers.js, web3-react
- **Package Management**: Yarn
- **Build System**: Create React App with CRACO customization

## Development Environment

- **Node.js**: >=16 (based on package.json engines specification)
- **OS**: macOS 24.4.0 (darwin)
- **Shell**: /bin/zsh

## Key Dependencies

- `@keep-network/tbtc-v2.ts`: SDK for interacting with tBTC protocol
- `@threshold-network/components`: UI components library
- `@threshold-network/solidity-contracts`: Threshold Network contracts
- `@mysten/sui`: SUI blockchain interaction
- `@suiet/wallet-kit`: SUI wallet integration
- `@solana/wallet-adapter-*`: Solana wallet adapters (potentially used for SUI integration)
- `@walletconnect/ethereum-provider`: For WalletConnect support
- `@ledgerhq/connect-kit-loader`: For Ledger integration

## Cross-Chain Setup

- **Primary Network**: Ethereum (Sepolia Testnet)
- **Target L2 Network**: SUI Testnet
- **Bridge Technology**: Wormhole for cross-chain communication

## Contract Information

- **BTCDepositorWormhole Proxy**: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95 (Sepolia)
- **Implementation Contract**: 0x75757a633237D7bb0c51b51952F171BE20C60056 (Sepolia)
- **ProxyAdmin**: 0x8E6C6f8e1551ba79D9ECe97fd584BbE7572cE79f (Sepolia)
- **SUI Wormhole Gateway**: 0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7
- **Wormhole Chain ID for SUI**: 21

## Configuration Notes

- The application uses environment variables for configuration (.env files)
- Current configuration targets Sepolia testnet (REACT_APP_DEFAULT_PROVIDER_CHAIN_ID=11155111)
- Feature flags control specific functionality (TBTC_V2, MULTI_APP_STAKING, etc.)
- Integration requires local linking of tbtc-v2.ts SDK
