# Threshold Token Dashboard

[![Token Dashboard / CI](https://github.com/threshold-network/token-dashboard/actions/workflows/dashboard-ci.yml/badge.svg?branch=main&event=push)](https://github.com/threshold-network/token-dashboard/actions/workflows/dashboard-ci.yml)
[![Docs](https://img.shields.io/badge/docs-website-green)](https://docs.threshold.network)
[![Chat with us on Discord](https://img.shields.io/badge/chat-Discord-5865f2.svg)](https://discord.gg/threshold)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Local development

## Prerequisites

- Make sure your local chain is running (e.g. Ganache) and all repos listed below are cloned to the same folder (e.g. `threshold-network`).
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
- Clone https://github.com/threshold-network/components repo

## Setup

`yarn`

## Deploy contracts and run dapp

`yarn start:dev`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**Note:** if you need re run T dapp and all necessary contracts are deployed use `yarn start:dev -m`

## Recompile `components` repo

To make sure the changes made in local depository of `components` lib are implemented in T dapp you should recompile the lib using:

`yarn add-components-lib`

# Run T dapp against the Görli network

## Update the `.env` file:

```
REACT_APP_SUPPORTED_CHAIN_ID=5
REACT_APP_ETH_HOSTNAME_HTTP=<your http ETH hostname- eg. Infura>
REACT_APP_ETH_HOSTNAME_WS=<your ws ETH hostname- eg. Infura>
// We can skip this env variable- the dapp uses the correct address
// of Multicall contract for Görli under the hood.
REACT_APP_MULTICALL_ADDRESS=$MULTICALL_ADDRESS
```

## Setup

`yarn`

## Install Görli contracts

```
yarn upgrade @keep-network/coverage-pools@goerli \
  @keep-network/ecdsa@goerli \
  @keep-network/keep-core@goerli \
  @keep-network/keep-ecdsa@goerli \
  @keep-network/random-beacon@goerli \
  @keep-network/tbtc@goerli \
  @keep-network/tbtc-v2@goerli \
  @keep-network/tbtc-v2.ts@goerli \
  @threshold-network/coverage-pools@npm:@keep-network/coverage-pools@goerli \
  @threshold-network/solidity-contracts@goerli
```

**NOTE 1:** We use the same Goerli versions for both
`@keep-network/coverage-pools` and `@threshold-network/coverage-pools`, because
we don't have the newest version of the package on Goerli network, only on the
Mainnet.

**NOTE 2:** If you encounter an `expected manifest` error while executing this,
then try providing an explicit version of the `keep-core` package:
`@keep-network/keep-core@1.8.1-goerli.0`
The error is probably caused by a bug in Yarn:
https://github.com/yarnpkg/yarn/issues/4731.

**NOTE 3:** The `token-dashboard` package contains an indirect dependency to
`@summa-tx/relay-sol@2.0.2` package, which downloads one of its sub-dependencies
via unathenticated `git://` protocol. That protocol is no longer supported by
GitHub. This means that in certain situations installation of the package or
update of its dependencies using Yarn may result in `The unauthenticated git protocol on port 9418 is no longer supported` error.

As a workaround, we advise changing Git configuration to use `https://` protocol
instead of `git://` by executing:

```
git config --global url."https://".insteadOf git://
```

## Run T dapp

`yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Production deployment

The following procedure allows to deploy T token dashboard to production:

1. Developer with write access to the repository creates a release branch:
   `releases/mainnet/<version>`. Release branch should never be merged to `main`
   and creating a PR with a release branch is not required.
   Dependencies and project version needs to be updated on the release branch.
   All `-dev`, `-goerli` dependencies need to be updated to mainnet versions.
   See [this commit](https://github.com/threshold-network/token-dashboard/commit/5452b68886ebc514d941a087973dfa9ac3802a7e)
   for `v1.0.0` release as a good example.
2. Preview of the release branch will be uploaded to `preview.dashboard.threshold.network`
   under the directory named after the release branch. For example:
   `https://preview.dashboard.threshold.network/releases/mainnet/v1.0.0/index.html`.
   A new version will be uploaded after each push to the release branch.
3. After reviewing the mainnet dashboard preview, any developer with write
   access to the repository can tag the commit on the release branch and create
   a new release on GitHub.
4. Once a new release is created, GitHub Action for mainnet T dashboard
   deployment will get automatically invoked. This action requires the manual
   approval of someone else from the development team.
5. Once the release action is approved, the new version is automatically
   deployed to `dashboard.threshold.network`.

## Local Development

Update `package.json` to contain:

```json
    "@keep-network/coverage-pools": "goerli",
    "@keep-network/ecdsa": "goerli",
    "@keep-network/keep-core": "1.8.1-goerli.0",
    "@keep-network/keep-ecdsa": "goerli",
    "@keep-network/random-beacon": "goerli",
    "@keep-network/tbtc": "goerli",
    "@keep-network/tbtc-v2": "goerli",
    "@keep-network/tbtc-v2.ts": "development",
    "@threshold-network/components": "development",
    "@threshold-network/solidity-contracts": "goerli",
```

Update `.env` to contain:

```
REACT_APP_SUPPORTED_CHAIN_ID=5
REACT_APP_ETH_HOSTNAME_HTTP=https://goerli.infura.io/v3/<your API key here>
REACT_APP_ETH_HOSTNAME_WS=wss://goerli.infura.io/v3/<your API key here>
REACT_APP_MULTICALL_ADDRESS=$MULTICALL_ADDRESS

REACT_APP_FEATURE_FLAG_TBTC_V2=true
REACT_APP_FEATURE_FLAG_TBTC_V2_REDEMPTION=true
REACT_APP_FEATURE_FLAG_MULTI_APP_STAKING=true
REACT_APP_FEATURE_FLAG_FEEDBACK_MODULE=false
REACT_APP_FEATURE_FLAG_POSTHOG=false
REACT_APP_FEATURE_FLAG_SENTRY=$SENTRY_SUPPORT
REACT_APP_SENTRY_DSN=$SENTRY_DSN

REACT_APP_ELECTRUM_PROTOCOL=wss
REACT_APP_ELECTRUM_HOST=electrumx-server.test.tbtc.network
REACT_APP_ELECTRUM_PORT=8443
REACT_APP_MOCK_BITCOIN_CLIENT=false

REACT_APP_WALLET_CONNECT_PROJECT_ID=$WALLET_CONNECT_PROJECT_ID
```

Then build the docker container and run the dashboard:

```bash
docker build -t dashboard:latest .
docker run -p 3000:3000 -d dashboard
```
