import KeepTokenStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { useContract } from "./useContract"
import { SupportedChainIds } from "../../networks/enums/networks"
import { AddressZero } from "@ethersproject/constants"
import { useDefaultOrConnectedChainId } from "../../networks/hooks/useDefaultOrConnectedChainId"

const KEEP_STAKING_ADDRESSES = {
  // https://etherscan.io/address/0x1293a54e160D1cd7075487898d65266081A15458
  [SupportedChainIds.Ethereum]: "0x1293a54e160D1cd7075487898d65266081A15458",
  // https://sepolia.etherscan.io/address/0xa07f4E37C2E7089Ea3AFffbe51A6A281833a4D14
  [SupportedChainIds.Sepolia]: "0xa07f4E37C2E7089Ea3AFffbe51A6A281833a4D14",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number, string>

export const useKeepTokenStakingContract = () => {
  const defaultOrConnectedChainId = useDefaultOrConnectedChainId()

  return useContract(
    KEEP_STAKING_ADDRESSES[Number(defaultOrConnectedChainId)],
    KeepTokenStaking.abi
  )
}
