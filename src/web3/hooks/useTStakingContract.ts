import TStakingContract from "@threshold-network/solidity-contracts/artifacts/TokenStaking.json"
import { supportedChainId } from "../../utils/getEnvVariable"
import { useContract } from "./useContract"

export const T_STAKING_CONTRACT_DEPLOYMENT_BLOCK =
  supportedChainId === "1" ? 14113768 : 0

export const useTStakingContract = () => {
  return useContract(TStakingContract.address, TStakingContract.abi)
}
