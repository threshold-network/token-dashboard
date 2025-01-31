# Threshold Token Dashboard

[![Token Dashboard / CI](https://github.com/threshold-network/token-dashboard/actions/workflows/dashboard-ci.yml/badge.svg?branch=main&event=push)](https://github.com/threshold-network/token-dashboard/actions/workflows/dashboard-ci.yml)
[![Docs](https://img.shields.io/badge/docs-website-green)](https://docs.threshold.network)
[![Chat with us on Discord](https://img.shields.io/badge/chat-Discord-5865f2.svg)](https://discord.gg/threshold)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Run T dapp against the Sepolia network

## Update the `.env` file:

```
REACT_APP_DEFAULT_PROVIDER_CHAIN_ID=11155111
REACT_APP_ALCHEMY_API=<your Alchemy API key>
// We can skip this env variable- the dapp uses the correct address
// of Multicall contract for Sepolia under the hood.
REACT_APP_MULTICALL_ADDRESS=$MULTICALL_ADDRESS
```

## Setup

`yarn`

## Install Sepolia contracts

```
yarn upgrade @keep-network/keep-core@sepolia \
  @keep-network/keep-ecdsa@sepolia \
  @keep-network/random-beacon@sepolia \
  @keep-network/tbtc@sepolia \
  @threshold-network/solidity-contracts@sepolia
```

**NOTE 1:** If you encounter an `expected manifest` error while executing this,
then try providing an explicit version of the `keep-core` package:
`@keep-network/keep-core@1.8.1-sepolia.0`
The error is probably caused by a bug in Yarn:
https://github.com/yarnpkg/yarn/issues/4731.

**NOTE 2:** The `token-dashboard` package contains an indirect dependency to
`@summa-tx/relay-sol@2.0.2` package, which downloads one of its sub-dependencies
via unathenticated `git://` protocol. That protocol is no longer supported by
GitHub. This means that in certain situations installation of the package or
update of its dependencies using Yarn may result in `The unauthenticated git protocol on port 9418 is no longer supported` error.

As a workaround, we advise changing Git configuration to use `https://` protocol
instead of `git://` by executing:

```
git config --global url."https://".insteadOf git://
```

**Sepolia-dev contracts**

Ref: https://github.com/keep-network/tbtc-v2/pull/403

Instead of the `sepolia` contracts above you can also use `dapp-development-sepolia` contracts. They offer shorter durations for some specific elements in the contracts in comparison to `sepolia`/`mainnet` and also allow to manually control mint and unmint process of `tbtc-v2` (for more information see please see https://github.com/keep-network/tbtc-v2/pull/403). To install sepolia-dev contracts run:

```
yarn @keep-network/keep-core@sepolia \
  @keep-network/keep-ecdsa@sepolia \
  @keep-network/random-beacon@dapp-development-sepolia \
  @keep-network/tbtc@sepolia \
  @threshold-network/solidity-contracts@dapp-development-sepolia
```

and set the `REACT_APP_DAPP_DEVELOPMENT_TESTNET_CONTRACTS` variable in `.env` file to true:

```
(...)
REACT_APP_DAPP_DEVELOPMENT_TESTNET_CONTRACTS=true
(...)
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
   All `-dev`, `-sepolia` dependencies need to be updated to mainnet versions.
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

Update `.env` to contain:

```
REACT_APP_DEFAULT_PROVIDER_CHAIN_ID=11155111
REACT_APP_ALCHEMY_API=<your Alchemy API key here>
REACT_APP_MULTICALL_ADDRESS=$MULTICALL_ADDRESS

REACT_APP_FEATURE_FLAG_TBTC_V2=true
REACT_APP_FEATURE_FLAG_TBTC_V2_REDEMPTION=true
REACT_APP_FEATURE_FLAG_MULTI_APP_STAKING=true
REACT_APP_FEATURE_FLAG_FEEDBACK_MODULE=false
REACT_APP_FEATURE_FLAG_LEDGER_LIVE=true

REACT_APP_FEATURE_FLAG_GOOGLE_TAG_MANAGER=false
REACT_APP_GOOGLE_TAG_MANAGER_ID=$GOOGLE_TAG_MANAGER_ID

REACT_APP_FEATURE_FLAG_POSTHOG=false

REACT_APP_FEATURE_FLAG_SENTRY=false
REACT_APP_SENTRY_DSN=$SENTRY_DSN
REACT_APP_FEATURE_FLAG_TRM=false

REACT_APP_MAINNET_ELECTRUM_PROTOCOL=$MAINNET_ELECTRUM_PROTOCOL
REACT_APP_MAINNET_ELECTRUM_HOST=$MAINNET_ELECTRUM_HOST
REACT_APP_MAINNET_ELECTRUM_PORT=$MAINNET_ELECTRUM_PORT
REACT_APP_TESTNET_ELECTRUM_PROTOCOL=wss
REACT_APP_TESTNET_ELECTRUM_HOST=electrumx-server.test.tbtc.network
REACT_APP_TESTNET_ELECTRUM_PORT=8443
REACT_APP_MOCK_BITCOIN_CLIENT=false

REACT_APP_WALLET_CONNECT_PROJECT_ID=$WALLET_CONNECT_PROJECT_ID

REACT_APP_TBTC_SUBGRAPH_API=$TBTC_SUBGRAPH_API

REACT_APP_TACO_DOMAIN=dashboard
```

Then build the docker container and run the dashboard:

```bash
docker-compose up --build
```
