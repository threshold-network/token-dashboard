import { BitcoinClientCredentials } from "../threshold-ts/types"
import { EnvVariable } from "../enums"
import { getEnvVariable, getDefaultProviderChainId } from "./getEnvVariable"
import { SupportedChainIds } from "../networks/enums/networks"

export const getDefaultBitcoinCredentials = () => {
  // Determine if we're on mainnet or testnet based on the default provider chain ID
  const chainId = getDefaultProviderChainId()
  const isMainnet = chainId === SupportedChainIds.Ethereum

  // Use the appropriate Electrum config based on network
  const prefix = isMainnet ? "MAINNET_" : "TESTNET_"

  const credentials: BitcoinClientCredentials[] = [
    {
      host:
        process.env[`REACT_APP_${prefix}ELECTRUM_HOST`] ||
        getEnvVariable(EnvVariable.ELECTRUM_HOST),
      port: +(
        process.env[`REACT_APP_${prefix}ELECTRUM_PORT`] ||
        getEnvVariable(EnvVariable.ELECTRUM_PORT)
      ),
      protocol: (process.env[`REACT_APP_${prefix}ELECTRUM_PROTOCOL`] ||
        getEnvVariable(
          EnvVariable.ELECTRUM_PROTOCOL
        )) as BitcoinClientCredentials["protocol"],
    },
  ]

  return credentials
}
