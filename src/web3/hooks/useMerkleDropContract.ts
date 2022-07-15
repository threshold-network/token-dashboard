import CumulativeMerkleDropABI from "../abi/CumulativeMerkleDrop.json"
import { useContract } from "./useContract"
import { supportedChainId } from "../../utils/getEnvVariable"
import { ChainID } from "../../enums"
import { AddressZero } from "../utils"

export const DEPLOYMENT_BLOCK = supportedChainId === "1" ? 0 : 0

const CONTRACT_ADDRESSESS = {
  // TODO: Set mainnet address
  [ChainID.Ethereum.valueOf().toString()]:
    "0xcE14F142f16cb0f360b8EB021A780ed3EC04516c",
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
