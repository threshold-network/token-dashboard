// TODO: how to get this contract on mainnet- check if we could add this
// artifact to the mainnet version of `@threshold-network/solidity-contracts`.
// To test it locallt switch to `nu-contracts` branch of
// `https://github.com/threshold-network/solidity-contracts` repo.
import SimplePREApplication from "@threshold-network/solidity-contracts/artifacts/SimplePREApplication.json"
import { supportedChainId } from "../../utils/getEnvVariable"
import { useContract } from "./useContract"

export const PRE_DEPLOYMENT_BLOCK = supportedChainId === "1" ? 14141140 : 0

export const usePREContract = () => {
  return useContract(SimplePREApplication.address, SimplePREApplication.abi)
}
