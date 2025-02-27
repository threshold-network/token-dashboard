import { useContract } from "./useContract"
import { MULTICALL_ADDRESSES } from "../../threshold-ts/multicall"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"

const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) view returns (uint256 blockNumber, bytes[] returnData)",
  "function getEthBalance(address addr) view returns (uint256 balance)",
]

export const useMulticallContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()

  return useContract(
    MULTICALL_ADDRESSES[Number(defaultOrConnectedChainId)],
    MULTICALL_ABI
  )
}
