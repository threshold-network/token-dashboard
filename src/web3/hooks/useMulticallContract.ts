import { AddressZero } from "@ethersproject/constants"
import { ChainID } from "../../enums"
import { supportedChainId } from "../../utils/getEnvVariable"
import { useContract } from "./useContract"

const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
]

// Addresses exported from:
// https://github.com/makerdao/multicall#multicall-contract-addresses
const MULTICALL_ADDRESSESS = {
  [ChainID.Ethereum.valueOf()]: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  // The `makerdao/multicall` repo is deprecated and there is a third-party
  // fork that deployed Multicall3:
  // https://github.com/mds1/multicall#existing-deployments.
  [ChainID.Sepolia.valueOf()]: "0xcA11bde05977b3631167028862bE2a173976CA11",
  [ChainID.Localhost.valueOf()]:
    process.env.REACT_APP_MULTICALL_ADDRESS || AddressZero,
} as Record<number, string>

export const useMulticallContract = () => {
  return useContract(
    MULTICALL_ADDRESSESS[Number(supportedChainId)],
    MULTICALL_ABI
  )
}
