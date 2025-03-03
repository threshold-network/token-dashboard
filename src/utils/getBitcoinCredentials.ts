import { BitcoinNetwork } from "@keep-network/tbtc-v2.ts"
import { BitcoinClientCredentials } from "../threshold-ts/types"
import { EnvVariable } from "../enums"
import { getEnvVariable } from "./getEnvVariable"

export const getBitcoinCredentials = (bitcoinNetwork: BitcoinNetwork) => {
  const credentials: BitcoinClientCredentials[] =
    bitcoinNetwork === BitcoinNetwork.Mainnet
      ? [
          {
            host: getEnvVariable(EnvVariable.MAINNET_ELECTRUM_HOST),
            port: +getEnvVariable(EnvVariable.MAINNET_ELECTRUM_PORT),
            protocol: getEnvVariable(
              EnvVariable.MAINNET_ELECTRUM_PROTOCOL
            ) as BitcoinClientCredentials["protocol"],
          },
        ]
      : [
          {
            host: getEnvVariable(EnvVariable.TESTNET_ELECTRUM_HOST),
            port: +getEnvVariable(EnvVariable.TESTNET_ELECTRUM_PORT),
            protocol: getEnvVariable(
              EnvVariable.TESTNET_ELECTRUM_PROTOCOL
            ) as BitcoinClientCredentials["protocol"],
          },
        ]

  return credentials
}
