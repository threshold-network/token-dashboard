import { useErc20TokenContract } from "./useERC20"
import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"

export const TBTC_ADDRESSES = {
  // https://etherscan.io/address/0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa
  [SupportedChainIds.Ethereum]: "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number | string, string>

export const useTBTCTokenContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()
  return useErc20TokenContract(
    TBTC_ADDRESSES[Number(defaultOrConnectedChainId)]
  )
}
