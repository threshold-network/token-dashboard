import CumulativeMerkleDropABI from "../abi/CumulativeMerkleDrop.json"
import { useContract } from "./useContract"
import { AddressZero } from "../utils"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useWeb3React } from "@web3-react/core"
import { useConnectedOrDefaultEthereumChainId } from "../../networks/hooks/useConnectedOrDefaultEthereumChainId"

const DEPLOYMENT_BLOCKS: { [key: number]: number } = {
  [SupportedChainIds.Ethereum]: 15146501,
  [SupportedChainIds.Sepolia]: 4653467,
}

const MERKLE_DROP_ADDRESSES = {
  // https://etherscan.io/address/0xea7ca290c7811d1cc2e79f8d706bd05d8280bd37
  [SupportedChainIds.Ethereum]: "0xeA7CA290c7811d1cC2e79f8d706bD05d8280BD37",
  // https://sepolia.etherscan.io/address/0x4621a14bbB5a53f79Ea532bdc032b8ACc383B153
  [SupportedChainIds.Sepolia]: "0x4621a14bbB5a53f79Ea532bdc032b8ACc383B153",
  // TODO: Set local address- how to resolve it in local network?
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number, string>

export const getMerkleDropDeploymentBlock = (chainId?: string | number) => {
  return DEPLOYMENT_BLOCKS[Number(chainId)] || 0
}

export const useMerkleDropContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultEthereumChainId()

  return useContract(
    MERKLE_DROP_ADDRESSES[Number(defaultOrConnectedChainId)],
    CumulativeMerkleDropABI
  )
}
