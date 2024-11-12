import SimplePREApplicationABI from "../abi/SimplePreApplication.json"
import { useContract } from "./useContract"
import { SupportedChainIds } from "../../networks/enums/networks"
import { AddressZero } from "../utils"
import { useIsActive } from "../../hooks/useIsActive"

const PRE_ADDRESSES = {
  // https://etherscan.io/address/0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd
  [SupportedChainIds.Ethereum]: "0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd",
  // https://sepolia.etherscan.io/address/0x471EA40981D278fb3Cb55587e94ac549aad1ACA9
  // As NuCypher hasn't depoyed the `SimplePreApplication` contract on Sepolia,
  // we're using a stub contract.
  [SupportedChainIds.Sepolia]: "0x471EA40981D278fb3Cb55587e94ac549aad1ACA9",
  // Set the correct `SimplePREApplication` contract address. If you deployed
  // the `@threshold-network/solidity-contracts` to your local chain and linked
  // package using `yarn link @threshold-network/solidity-contracts` you can
  // find the contract address at
  // `node_modules/@threshold-network/solidity-contracts/artifacts/SimplePREApplication.json`.
  [SupportedChainIds.Localhost]: AddressZero,
} as Record<string, string>

export const usePREContract = () => {
  const { chainId } = useIsActive()
  return useContract(
    PRE_ADDRESSES[Number(chainId)] || PRE_ADDRESSES[SupportedChainIds.Ethereum],
    SimplePREApplicationABI
  )
}
