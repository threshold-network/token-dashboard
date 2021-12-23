# Deploying `Multicall` via hardhat

Deploying the
[`Multicall`](https://github.com/makerdao/multicall/blob/master/src/Multicall.sol)
contract to local network via `hardhat` to test integration with
[`Multicall`](https://github.com/makerdao/multicall/blob/master/src/Multicall.sol)
contract in T dapp locally. There is no need to deploy this contract to
`Ropsten` or `Mainnet` network- you can find contract addresses at
https://github.com/makerdao/multicall#multicall-contract-addresses.

# Prerequisites

- Make sure your local chain is running (eg. Ganache).
- Verfiy `development` network config in `hardhat.config.ts` file- set the correct `chainId` and `url`.

# Usage

## Setup

`yarn`

## Deploy `Multicall` contract

`yarn deploy:development`
