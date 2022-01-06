# Threshold Token Dashboard

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Local development

## Prerequisites

- Make sure your local chain is running (eg. Ganache).
- Clone https://github.com/keep-network/keep-core repo:
  - Make sure the `local` network config in [`/solidity-v1/truffle-config.js`](https://github.com/keep-network/keep-core/blob/main/solidity-v1/truffle-config.js#L8-L11) is correct for your chain.
- Clone https://github.com/threshold-network/solidity-contracts repo:
  - Make sure the `development` network config in [`hardhat.config.ts`](https://github.com/threshold-network/solidity-contracts/blob/main/hardhat.config.ts#L42-L44) is correct for your chain.
- Clone https://github.com/keep-network/keep-ecdsa repo:
  - Make sure the `local` network config in [`/solidity/truffle.js`](https://github.com/keep-network/keep-ecdsa/blob/main/solidity/truffle.js#L30-L35) is correct for your chain.
- Clone https://github.com/keep-network/tbtc repo:
  - Make sure the `development` network config in [`/solidity/truffle-config.js`](https://github.com/keep-network/tbtc/blob/main/solidity/truffle-config.js#L54-L58) is correct for your chain.
- Clone https://github.com/keep-network/coverage-pools repo:
  - Make sure the `development` network config in [`/hardhat.config.ts`](https://github.com/keep-network/coverage-pools/blob/main/hardhat.config.ts#L37-L41) is correct for your chain.

## Setup

`yarn`

## Deploy contracts and run dapp

`yarn start:dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Note:** if you need re run T dapp and all necessary contracts are deployed use `yarn start:dev -m`

# Run T dapp against the Ropsten network

## Update the `.env` file:

```
REACT_APP_SUPPORTED_CHAIN_ID=3
REACT_APP_ETH_HOSTNAME_HTTP=<your http ETH hostname- eg. Infura>
REACT_APP_ETH_HOSTNAME_WS=<your ws ETH hostname- eg. Infura>
// We can skip this env variable- the dapp uses the correct address
// of Multicall contract for Ropsten under the hood.
REACT_APP_MULTICALL_ADDRESS=$MULTICALL_ADDRESS
```

## Setup

`yarn`

## Install Ropsten contracts

```
yarn upgrade @threshold-network/solidity-contracts@ropsten \
  @keep-network/keep-core@ropsten \
  @keep-network/keep-ecdsa@ropsten \
  @keep-network/tbtc@ropsten \
  @keep-network/coverage-pools@ropsten
```

## Run T dapp

`yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
