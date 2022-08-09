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
  // https://ropsten.etherscan.io/address/0x835d2F36450c7d20cCE3b3F31aBa6BF2Ac31c6f3
  [ChainID.Ropsten.valueOf().toString()]:
    "0x835d2F36450c7d20cCE3b3F31aBa6BF2Ac31c6f3",
  // TODO: Set local address- how to resolve it in local network?
  [ChainID.Localhost.valueOf().toString()]: AddressZero,
} as Record<string, string>

export const useMerkleDropContract = () => {
  return useContract(
    CONTRACT_ADDRESSESS[supportedChainId],
    CumulativeMerkleDropABI
  )
}
