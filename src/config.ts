import { getEnvVariable } from "./utils/getEnvVariable"
import { EnvVariable } from "./enums"

const infuraId = getEnvVariable(EnvVariable.InfuraID)

export const RPC_URL = {
  // TODO: Need to use the real infura account for Thesis/Keep
  1: `wss://mainnet.infura.io/ws/v3/${infuraId}`,
  3: `wss://ropsten.infura.io/ws/v3/${infuraId}`,
}
