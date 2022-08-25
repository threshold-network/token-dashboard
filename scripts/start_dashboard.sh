#!/bin/bash
set -euo pipefail

LOG_START='\n\e[1;36m' # new line + bold + color
LOG_END='\n\e[0m' # new line + reset color

help()
{
   echo -e "\nUsage: $0"\
           "--multicall-only"
   echo -e "\nCommand line arguments:\n"
   echo -e "\t--multicall-only: Should execute Multicall contract part only."\
                        "Other deployment scripts will not be executed.\n"
   exit 1 # Exit script after printing help
}

# Transform long options to short ones
for arg in "$@"; do
  shift
  case "$arg" in
    "--multicall-only") set -- "$@" "-m" ;;
    "--help")           set -- "$@" "-h" ;;
    *)                  set -- "$@" "$arg"
  esac
done

# Parse short options
OPTIND=1
while getopts "mh" opt; do
  case "$opt" in
  m ) multicall_only=true ;;
  h ) help ;;
  ? ) help ;; # Print help in case parameter is non-existent
  esac
done
shift $(expr $OPTIND - 1) # remove options from positional parameters

MULTICALL_ONLY=${multicall_only:-false}

DASHBOARD_PATH=$PWD
MULTICALL_PATH="$DASHBOARD_PATH/multicall"
THRESHOLD_CONTRACTS_PATH="$PWD/../solidity-contracts"

KEEP_CORE_PATH="$PWD/../keep-core"
KEEP_CORE_SOL_PATH="$KEEP_CORE_PATH/solidity-v1"

KEEP_ECDSA_PATH="$PWD/../keep-ecdsa"
KEEP_ECDSA_SOL_PATH="$KEEP_ECDSA_PATH/solidity"

COV_POOLS_PATH="$PWD/../coverage-pools"

TBTC_PATH="$PWD/../tbtc/"
TBTC_SOL_PATH="$TBTC_PATH/solidity"

ECDSA_CONTRACTS_PATH="$PWD/../keep-core/solidity/ecdsa"

RANDOM_BEACON_CONTRACTS_PATH="$PWD/../keep-core/solidity/random-beacon"

TBTC_V2_CONTRACTS_PATH="$PWD/../tbtc-v2/solidity"

COMPONENTS_LIB_PATH="$PWD/../components/"

function start_dashboard {
    cd "$DASHBOARD_PATH"
    printf "${LOG_START}Installing T Token Dashboard...${LOG_END}"
    yarn
    yarn link @threshold-network/solidity-contracts \
        @keep-network/keep-core \
        @keep-network/keep-ecdsa \
        @keep-network/tbtc \
        @keep-network/coverage-pools

    printf "${LOG_START}Starting dashboard...${LOG_END}"
    MULTICALL_ADDRESS="${MULTICALL_ADDRESS}" yarn start
}

cd "$MULTICALL_PATH"
printf "${LOG_START}Installing multicall dependencies...${LOG_START}"
yarn
printf "${LOG_START}Deploying contracts for multicall...${LOG_START}"
MULTICALL_ADDRESS_OUTPUT=$(yarn deploy:development)
MULTICALL_ADDRESS=$(echo "$MULTICALL_ADDRESS_OUTPUT" | tail -1)
printf "${LOG_START}Multicall address deployed at ${MULTICALL_ADDRESS}${LOG_END}"

if [ "$MULTICALL_ONLY" = true ]; then
 start_dashboard
 exit 0
fi

printf "${LOG_START}Migrating contracts for keep-core...${LOG_END}"
cd "$KEEP_CORE_PATH"
./scripts/install-v1.sh --network local
cd "$KEEP_CORE_SOL_PATH"
yarn link

printf "${LOG_START}Migrating contracts for keep-ecdsa...${LOG_END}"
cd "$KEEP_ECDSA_PATH"
./scripts/install.sh --network local --contracts-only
cd "$KEEP_ECDSA_SOL_PATH"
yarn link

printf "${LOG_START}Migrating contracts for tBTC...${LOG_END}"
cd "$TBTC_PATH"
./scripts/install.sh
cd "$TBTC_SOL_PATH"
yarn link

cd $COV_POOLS_PATH
printf "${LOG_START}Migrating contracts for coverage pools...${LOG_END}"
yarn
yarn link @keep-network/keep-core @keep-network/tbtc
yarn deploy --network development --reset
./scripts/prepare-artifacts.sh --network development
yarn link

cd "$THRESHOLD_CONTRACTS_PATH"
printf "${LOG_START}Installing Threshold network solidity contracts dependencies...${LOG_START}"
yarn
yarn link @keep-network/keep-core
./scripts/prepare-dependencies.sh
printf "${LOG_START}Deploying contracts for threshold solidity contracts...${LOG_START}"
yarn deploy --network development --reset
yarn hardhat prepare-artifacts --network development
yarn link

# cd $RANDOM_BEACON_CONTRACTS_PATH
# printf "${LOG_START}Migrating contracts for random-beacon...${LOG_END}"
# yarn
# yarn link @keep-network/keep-core @threshold-network/solidity-contracts
# yarn deploy --network development --reset
# ./scripts/prepare-artifacts.sh --network development
# yarn link

# cd $ECDSA_CONTRACTS_PATH
# printf "${LOG_START}Migrating contracts for ecdsa...${LOG_END}"
# yarn
# yarn link @keep-network/keep-core @threshold-network/solidity-contracts
# yarn deploy --network development --reset
# ./scripts/prepare-artifacts.sh --network development
# yarn link

# cd $TBTC_V2_CONTRACTS_PATH
# printf "${LOG_START}Migrating contracts for tbtc-v2...${LOG_END}"
# yarn
# yarn link @threshold-network/solidity-contracts \
#         @keep-network/keep-core \
#         @keep-network/tbtc \
#         @keep-network/random-beacon \
#         @keep-network/ecdsa
# yarn deploy --network development --reset
# ./scripts/prepare-artifacts.sh --network development
# yarn link

cd $COMPONENTS_LIB_PATH
printf "${LOG_START}Installing local components package...${LOG_START}"
yarn
cd "$DASHBOARD_PATH"
yarn add-components-lib

start_dashboard
