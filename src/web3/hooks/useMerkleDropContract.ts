import CumulativeMerkleDropABI from "../abi/CumulativeMerkleDrop.json"
import { useContract } from "./useContract"
import { supportedChainId } from "../../utils/getEnvVariable"
import { ChainID } from "../../enums"
import { AddressZero } from "../utils"

export const DEPLOYMENT_BLOCK = supportedChainId === "1" ? 15146501 : 0

const CONTRACT_ADDRESSESS = {
  // https://etherscan.io/address/0xea7ca290c7811d1cc2e79f8d706bd05d8280bd37
  [ChainID.Ethereum.valueOf().toString()]:
    "0xeA7CA290c7811d1cC2e79f8d706bD05d8280BD37",
  // https://sepolia.etherscan.io/address/0x4621a14bbB5a53f79Ea532bdc032b8ACc383B153
  [ChainID.Sepolia.valueOf().toString()]:
    "0x4621a14bbB5a53f79Ea532bdc032b8ACc383B153",
  // TODO: Set local address- how to resolve it in local network?
  [ChainID.Localhost.valueOf().toString()]: AddressZero,
} as Record<string, string>

export const useMerkleDropContract = () => {
  return useContract(
    CONTRACT_ADDRESSESS[supportedChainId],
    CumulativeMerkleDropABI
  )
}
