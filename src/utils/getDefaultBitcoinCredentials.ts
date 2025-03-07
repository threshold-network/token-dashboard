import { BitcoinClientCredentials } from "../threshold-ts/types"
import { EnvVariable } from "../enums"
import { getEnvVariable } from "./getEnvVariable"

export const getDefaultBitcoinCredentials = () => {
  const credentials: BitcoinClientCredentials[] = [
    {
      host: getEnvVariable(EnvVariable.ELECTRUM_HOST),
      port: +getEnvVariable(EnvVariable.ELECTRUM_PORT),
      protocol: getEnvVariable(
        EnvVariable.ELECTRUM_PROTOCOL
      ) as BitcoinClientCredentials["protocol"],
    },
  ]

  return credentials
}
