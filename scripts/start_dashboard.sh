#!/bin/bash
set -eo pipefail

LOG_START='\n\e[1;36m' # new line + bold + color
LOG_END='\n\e[0m' # new line + reset color

DASHBOARD_PATH=$PWD
MULTICALL_PATH="$DASHBOARD_PATH/multicall"
THRESHOLD_CONTRACTS_PATH="$PWD/../solidity-contracts"
KEEP_CORE_SOL_PATH="$PWD/../keep-core/solidity-v1"

cd "$KEEP_CORE_SOL_PATH"
printf "${LOG_START}Installing Keep core dependencies...${LOG_START}"
npm install
printf "${LOG_START}Deploying contracts for keep-core...${LOG_START}"
npx truffle migrate --reset --network local
rm -rf artifacts
cp -r build/contracts artifacts
yarn link

cd "$THRESHOLD_CONTRACTS_PATH"
printf "${LOG_START}Installing Threshold network solidity contracts dependencies...${LOG_START}"
yarn
yarn link @keep-network/keep-core
printf "${LOG_START}Deploying contracts for threshold solidity contracts...${LOG_START}"
yarn deploy --network development --reset
./scripts/prepare-artifacts.sh --network development
yarn link

cd "$MULTICALL_PATH"
printf "${LOG_START}Installing multicall dependencies...${LOG_START}"
yarn
printf "${LOG_START}Deploying contracts for multicall...${LOG_START}"
MULTICALL_ADDRESS_OUTPUT=$(yarn deploy:development)
MULTICALL_ADDRESS=$(echo "$MULTICALL_ADDRESS_OUTPUT" | tail -1)
printf "${LOG_START}Multicall address deployed at ${MULTICALL_ADDRESS}${LOG_END}"

cd "$DASHBOARD_PATH"
printf "${LOG_START}Installing T Token Dashboard...${LOG_END}"
yarn
yarn link @keep-network/keep-core @threshold-network/solidity-contracts
printf "${LOG_START}Starting dashboard...${LOG_END}"
MULTICALL_ADDRESS="${MULTICALL_ADDRESS}" yarn start
