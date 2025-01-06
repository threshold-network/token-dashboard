import { useErc20TokenContract } from "./useERC20"
import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useConnectedOrDefaultChainId } from "../../networks/hooks/useConnectedOrDefaultChainId"

export const TBTCV2_ADDRESSES = {
  // https://etherscan.io/address/0x18084fbA666a33d37592fA2633fD49a74DD93a88
  [SupportedChainIds.Ethereum]: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
  // https://sepolia.etherscan.io/address/0x517f2982701695D4E52f1ECFBEf3ba31Df470161
  [SupportedChainIds.Sepolia]: "0x517f2982701695D4E52f1ECFBEf3ba31Df470161",
  [SupportedChainIds.ArbitrumSepolia]:
    "0xb8f31A249bcb45267d06b9E51252c4793B917Cd0",
  [SupportedChainIds.Arbitrum]: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
  [SupportedChainIds.Base]: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
  [SupportedChainIds.BaseSepolia]: "0xb8f31A249bcb45267d06b9E51252c4793B917Cd0",
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<number | string, string>

// Switching wallet networks triggers an ethers error as the app fetches balances from an outdated
// Threshold class instance. A separate, independent instance for the TBTC v2 token is needed to
// handle network changes smoothly within the app's lifecycle.
export const useTBTCv2TokenContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultChainId()
  return useErc20TokenContract(
    TBTCV2_ADDRESSES[Number(defaultOrConnectedChainId)]
  )
}
