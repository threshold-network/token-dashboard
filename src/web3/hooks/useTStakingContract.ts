import TokenStakingABI from "../abi/TokenStaking.json"
import { useContract } from "./useContract"
import { SupportedChainIds } from "../../networks/enums/networks"
import { AddressZero } from "@ethersproject/constants"
import { useWeb3React } from "@web3-react/core"

const DEPLOYMENT_BLOCKS: { [key: number]: number } = {
  [SupportedChainIds.Ethereum]: 14113768,
  [SupportedChainIds.Sepolia]: 4653467,
}

const T_STAKING_ADDRESSES = {
  // https://etherscan.io/address/0x01B67b1194C75264d06F808A921228a95C765dd7
  [SupportedChainIds.Ethereum]: "0x01B67b1194C75264d06F808A921228a95C765dd7",
  // https://sepolia.etherscan.io/address/0x3d4cb85c0e3c5bd1667B7E30f3E86B3FAB878Ff8
  [SupportedChainIds.Sepolia]: "0x3d4cb85c0e3c5bd1667B7E30f3E86B3FAB878Ff8",
  // TODO: Set local address- how to resolve it in local network?
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number, string>

export const getTStakingDeploymentBlock = (chainId?: number | string) => {
  return DEPLOYMENT_BLOCKS[Number(chainId)] || 0
}

export const useTStakingContract = () => {
  const { chainId } = useWeb3React()
  return useContract(T_STAKING_ADDRESSES[Number(chainId)], TokenStakingABI)
}
