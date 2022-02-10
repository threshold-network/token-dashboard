import { HardhatUserConfig } from "hardhat/config"

import "@keep-network/hardhat-helpers"
import "hardhat-deploy"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },
  paths: {
    artifacts: "./build",
  },
  networks: {
    development: {
      url: "http://localhost:8545",
      chainId: 1337,
      tags: ["local"],
    },
  },
  // // Define local networks configuration file path to load networks from the file.
  // localNetworksConfig: "./.hardhat/networks.ts",
  namedAccounts: {
    deployer: {
      default: 0, // take the first account as deployer
    },
  },
}

export default config
