# Token Dashboard Project Brief

## Project Overview

The token-dashboard is a user interface for interacting with Threshold Network protocols, with a focus on the tBTC protocol that enables Bitcoin to Ethereum bridging. This project needs to be set up locally with a linked tbtc-v2.ts SDK package for development.

## Current Task

Set up and configure the token-dashboard locally to test SUI Network implementation, with the following requirements:

1. Link the local tbtc-v2 SDK (@keep-network/tbtc-v2.ts) with the token-dashboard project
2. Configure the token-dashboard to connect to testnet environment
3. Test the SUI Network implementation with deployed contracts:
   - BTCDepositorWormhole (upgradeable transparent proxy) on Sepolia Testnet
   - Proxy Address: 0xb306e0683f890BAFa669c158c7Ffa4b754b70C95
   - Implementation: 0x75757a633237D7bb0c51b51952F171BE20C60056
   - ProxyAdmin: 0x8E6C6f8e1551ba79D9ECe97fd584BbE7572cE79f
   - SUI Testnet Wormhole Gateway: 0x1db1fcdaada7c286d77f3347e593e06d8f33b8255e0861033a0a9f321f4eade7
   - Wormhole Chain ID for SUI: 21

## Dependencies

- tbtc-v2 local repository (with typescript SDK)
- token-dashboard repository
- Node.js environment
- Yarn package manager

## Success Criteria

- Local token-dashboard runs successfully
- Dashboard connects to Sepolia testnet
- Local tbtc-v2.ts SDK is properly linked
- SUI Network implementation can be tested through the UI
