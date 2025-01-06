import { EnvVariable } from "../../enums"
import { getEnvVariable } from "../../utils/getEnvVariable"
import {
  AlchemyNetworkId,
  InfuraNetworkId,
  NetworksName,
  NetworkType,
  RpcServices,
} from "../enums/networks"
import { RpcServiceConfig } from "../types/networks"
import { isTestnetNetwork } from "./connectedNetwork"

export function getRpcNetworkConfig(
  networkName: NetworksName,
  chainId: number | string
): RpcServiceConfig {
  const rpcServiceName = getEnvVariable(EnvVariable.RPC_SERVICE_NAME)
  const networkType = isTestnetNetwork(chainId)
    ? NetworkType.Testnet
    : NetworkType.Mainnet

  switch (rpcServiceName) {
    case RpcServices.Infura:
      return {
        networkId: InfuraNetworkId[networkName as keyof typeof InfuraNetworkId],
        networkType,
      }
    case RpcServices.Alchemy:
    default:
      return {
        networkId:
          AlchemyNetworkId[networkName as keyof typeof AlchemyNetworkId],
        networkType,
      }
  }
}
