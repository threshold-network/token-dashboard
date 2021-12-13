import { getEnvVariable } from "./getEnvVariable"
import { EnvVariable } from "../enums"
import * as net from "net"

const supportedChainId = getEnvVariable(EnvVariable.SupportedChainId)

console.log("su", supportedChainId)

const isSupportedNetwork = (networkChainId?: number) => {
  console.log(
    "is supported network",
    networkChainId,
    supportedChainId,
    networkChainId == supportedChainId
  )
  return networkChainId == supportedChainId
}

export default isSupportedNetwork
