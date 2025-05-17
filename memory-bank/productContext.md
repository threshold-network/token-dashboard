# Product Context

## tBTC Protocol Overview

tBTC is a decentralized protocol that allows Bitcoin holders to deposit their BTC and mint an equivalent amount of tBTC, an ERC-20 token representing Bitcoin on Ethereum and other networks. tBTC v2 is the latest version of this protocol with improved scalability and functionality.

## Core Features

- **Bitcoin to Ethereum Bridge**: Secure deposit of BTC to mint tBTC tokens
- **Multi-Network Support**: Expanding beyond Ethereum to other networks like SUI
- **Decentralized Custody**: BTC deposits secured by a decentralized group of signers
- **Redemption**: Convert tBTC back to BTC through a redemption process
- **Cross-Chain Integration**: Using Wormhole for bridging between different blockchains

## User Personas

1. **Bitcoin Holders**: Users with BTC who want to access Ethereum DeFi applications
2. **DeFi Users**: Ethereum users who want Bitcoin exposure in DeFi protocols
3. **Cross-Chain Builders**: Developers integrating Bitcoin with other chains like SUI
4. **Liquidity Providers**: Users providing liquidity for tBTC in various protocols

## Current Expansion: SUI Network Integration

- The current development focus is on extending tBTC to the SUI network
- This allows Bitcoin holders to access the SUI ecosystem through tBTC
- The integration uses Wormhole as the cross-chain messaging protocol
- Smart contracts are deployed on both Ethereum and SUI networks
- A specialized BTCDepositorWormhole contract handles the cross-chain deposits

## User Experience Flow

1. **Connection**: User connects Ethereum wallet and SUI wallet (if applicable)
2. **Deposit Initiation**: User starts a BTC deposit specifying SUI as the target network
3. **BTC Transfer**: User sends BTC to the generated address
4. **Cross-Chain Process**:
   - BTC is detected on Bitcoin network
   - tBTC minting is triggered on Ethereum
   - Cross-chain message is sent via Wormhole to SUI
   - Equivalent tBTC is available on SUI network
5. **Usage**: User can use tBTC in SUI ecosystem applications

## Technical Requirements

- **Local Development**: Testing SUI integration requires local setup of both projects
- **Contract Configuration**: Correct addresses for Wormhole and other contracts
- **Network Configuration**: Support for both Ethereum Sepolia and SUI Testnet
- **SDK Integration**: Local version of tbtc-v2.ts SDK for development flexibility

## Success Metrics

- **Functional Integration**: SUI deposit and bridging works end-to-end
- **Transaction Success Rate**: Cross-chain operations complete successfully
- **User Experience**: Intuitive UI for cross-chain deposits
- **Development Efficiency**: Local setup enables rapid iteration on changes
