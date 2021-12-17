import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { useContract } from "./useContract"
import { Token } from "../../enums"
import { UpgredableToken } from "../../types"

const TOKEN_TO_VENDING_MACHINE_ARTIFACT = {
  [Token.Keep]: VendingMachineKeep,
  [Token.Nu]: VendingMachineNuCypher,
}
export const useVendingMachineContract = (token: UpgredableToken) => {
  const vendingMachineArtifact = TOKEN_TO_VENDING_MACHINE_ARTIFACT[token]
  return useContract(vendingMachineArtifact.address, vendingMachineArtifact.abi)
}
