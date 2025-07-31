import { useErc20TokenContract } from "./useERC20"
import { AddressZero } from "@ethersproject/constants"
import { SupportedChainIds } from "../../networks/enums/networks"
import { useConnectedOrDefaultEthereumChainId } from "../../networks/hooks/useConnectedOrDefaultEthereumChainId"

export const TBTCV2_ADDRESSES = {
  // https://etherscan.io/address/0x18084fbA666a33d37592fA2633fD49a74DD93a88
  [SupportedChainIds.Ethereum]: "0x18084fbA666a33d37592fA2633fD49a74DD93a88",
  // https://sepolia.etherscan.io/address/0x517f2982701695D4E52f1ECFBEf3ba31Df470161
  [SupportedChainIds.Sepolia]: "0x517f2982701695D4E52f1ECFBEf3ba31Df470161",
  [SupportedChainIds.Arbitrum]: "0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40",
  [SupportedChainIds.Base]: "0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b",
  [SupportedChainIds.Localhost]: AddressZero,
  [SupportedChainIds.BaseSepolia]: "0xb8f31A249bcb45267d06b9E51252c4793B917Cd0",
  [SupportedChainIds.ArbitrumSepolia]:
    "0xb8f31A249bcb45267d06b9E51252c4793B917Cd0",
  [SupportedChainIds.Bob]: "0xBBa2eF945D523C4e2608C9E1214C2Cc64D4fc2e2",
  [SupportedChainIds.BobSepolia]: "0xD23F06550b0A7bC98B20eb81D4c21572a97598FA",
} as Record<number | string, string>

// Switching wallet networks triggers an ethers error as the app fetches balances from an outdated
// Threshold class instance. A separate, independent instance for the TBTC v2 token is needed to
// handle network changes smoothly within the app's lifecycle.
export const useTBTCv2TokenContract = () => {
  const defaultOrConnectedChainId = useConnectedOrDefaultEthereumChainId()
  return useErc20TokenContract(
    TBTCV2_ADDRESSES[Number(defaultOrConnectedChainId)]
  )
}
