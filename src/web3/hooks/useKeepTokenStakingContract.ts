import KeepTokenStaking from "@keep-network/keep-core/artifacts/TokenStaking.json"
import { useContract } from "./useContract"
import { SupportedChainIds } from "../../networks/enums/networks"
import { AddressZero } from "@ethersproject/constants"
import { useConnectedOrDefaultEthereumChainId } from "../../networks/hooks/useConnectedOrDefaultEthereumChainId"

const KEEP_STAKING_ADDRESSES = {
  // https://etherscan.io/address/0x1293a54e160D1cd7075487898d65266081A15458
  [SupportedChainIds.Ethereum]: "0x1293a54e160D1cd7075487898d65266081A15458",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number, string>

export const useKeepTokenStakingContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultEthereumChainId()

  return useContract(
    KEEP_STAKING_ADDRESSES[Number(defaultOrConnectedChainId)],
    KeepTokenStaking.abi
  )
}
