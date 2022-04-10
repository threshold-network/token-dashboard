import { useContract } from "./useContract"

// TODO: Get contract abi from the package and figure out how to use these
// contracts on ropsten and local network. This only works on mainnet.
const ESCROW_ABI = [
  {
    inputs: [],
    name: "currentPeriodSupply",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function",
  },
]
const ESCROW_ADDRESS = "0xbbD3C0C794F40c4f993B03F65343aCC6fcfCb2e2"

export const useNuStakingEscrowContract = () => {
  return useContract(ESCROW_ADDRESS, ESCROW_ABI)
}
