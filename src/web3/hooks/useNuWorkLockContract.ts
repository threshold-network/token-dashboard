import { useContract } from "./useContract"

// TODO: Get contract abi from the package and figure out how to use these
// contracts on ropsten and local network. This only works on mainnet.
const WORK_LOCK_ADDRESS = "0xe9778E69a961e64d3cdBB34CF6778281d34667c2"
const ABI = [
  {
    inputs: [],
    name: "escrow",
    outputs: [
      {
        internalType: "contract StakingEscrow",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export const useNuWorkLockContract = () => {
  return useContract(WORK_LOCK_ADDRESS, ABI)
}
