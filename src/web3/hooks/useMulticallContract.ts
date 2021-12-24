import { AddressZero } from "@ethersproject/constants"
import { useContract } from "./useContract"

const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
]

// Addresses exported from:
// https://github.com/makerdao/multicall#multicall-contract-addresses
const MULTICALL_ADDRESSESS = {
  1: "0xeefba1e63905ef1d7acba5a8513c70307c1ce441",
  3: "0x53c43764255c17bd724f74c4ef150724ac50a3ed",
  1337: "0xF43Dc7e54FF6fa5631098Ae9d5AC43B879ae51D0", //process.env.REACT_APP_MULTICALL_ADDRESS || AddressZero,
}
console.log("MULTICALL_ADDRESSESS[1337]", MULTICALL_ADDRESSESS["1337"])
export const useMulticallContract = () => {
  return useContract(
    // TODO: Get the chain id from env.
    MULTICALL_ADDRESSESS["1337"],
    MULTICALL_ABI
  )
}
