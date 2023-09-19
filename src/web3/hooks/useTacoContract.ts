import TacoApplicationABI from "../abi/TacoApplication.json"
import { useContract } from "./useContract"
import { supportedChainId } from "../../utils/getEnvVariable"
import { ChainID } from "../../enums"
import { AddressZero } from "../utils"

export const TACO_DEPLOYMENT_BLOCK = supportedChainId === "1" ? 14141140 : 0

const TACO_ADDRESSESS = {
  // https://etherscan.io/address/0x7E01c9c03FD3737294dbD7630a34845B0F70E5Dd
  [ChainID.Ethereum.valueOf().toString()]:
    AddressZero,
  [ChainID.Goerli.valueOf().toString()]:
    "0xA7FD8E3A4731FA6C3b9Bb65C21D7082151B38c36",
  [ChainID.Localhost.valueOf().toString()]: AddressZero,
} as Record<string, string>

export const useTacoContract = () => {
  return useContract(TACO_ADDRESSESS[supportedChainId], TacoApplicationABI)
}
