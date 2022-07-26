import SimplePREApplicationABI from "../abi/SimplePreApplication.json"
import { useContract } from "./useContract"
import { supportedChainId } from "../../utils/getEnvVariable"
import { ChainID } from "../../enums"
import { AddressZero } from "../utils"

export const PRE_DEPLOYMENT_BLOCK = supportedChainId === "1" ? 14141140 : 0

const PRE_ADDRESSESS = {
  // https://etherscan.io/address/0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd
  [ChainID.Ethereum.valueOf().toString()]:
    "0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd",
  // https://goerli.etherscan.io/address/0x829fdCDf6Be747FEA37518fBd83dF70EE371fCf2
  // As NuCypher hasn't depoyed the `SimplePreApplication` contract on Goerli,
  // we're using a stub contract.
  [ChainID.Goerli.valueOf().toString()]:
    "0x829fdCDf6Be747FEA37518fBd83dF70EE371fCf2",
  // Set the correct `SimplePREApplication` contract address. If you deployed
  // the `@threshold-network/solidity-contracts` to your local chain and linked
  // package using `yarn link @threshold-network/solidity-contracts` you can
  // find the contract address at
  // `node_modules/@threshold-network/solidity-contracts/artifacts/SimplePREApplication.json`.
  [ChainID.Localhost.valueOf().toString()]: AddressZero,
} as Record<string, string>

export const usePREContract = () => {
  return useContract(PRE_ADDRESSESS[supportedChainId], SimplePREApplicationABI)
}
