import { EnvVariable } from "../../enums"
import { getEnvVariable } from "../../utils/getEnvVariable"
import { MAIN_ALCHEMY_URL, MAIN_INFURA_URL } from "../constants/networks"
import { NetworksName, RpcServices, SupportedChainIds } from "../enums/networks"
import { getNetworkNameFromChainId } from "./getNetworkNameFromChainId"
import { getRpcNetworkConfig } from "./getRpcNetworkConfig"

export const getRpcEndpointUrl = (chainId?: number | string) => {
  const rpcServiceApi = getEnvVariable(EnvVariable.RPC_SERVICE_API)
  const rpcServiceName = getEnvVariable(EnvVariable.RPC_SERVICE_NAME)
  const defaultChainId = SupportedChainIds.Ethereum
  const chainIdNumber = Number(chainId) || defaultChainId
  const networkName = getNetworkNameFromChainId(chainIdNumber)

  if (networkName === "Unsupported") {
    return "http://localhost:8545"
  }
  const rpcConfig = getRpcNetworkConfig(networkName, chainIdNumber)

  switch (rpcServiceName) {
    case RpcServices.Infura:
      return networkName === NetworksName.Ethereum
        ? `https://${rpcConfig.networkType}.${MAIN_INFURA_URL}${rpcServiceApi}`
        : `https://${rpcConfig.networkId}-${rpcConfig.networkType}.${MAIN_INFURA_URL}${rpcServiceApi}`
    case RpcServices.Alchemy:
      return `https://${rpcConfig.networkId}-${rpcConfig.networkType}.${MAIN_ALCHEMY_URL}${rpcServiceApi}`
    default:
      return "http://localhost:8545"
  }
}
