// import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
// import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { useContract } from "./useContract"
import { Token } from "../../enums"
import { UpgredableToken } from "../../types"

// const TOKEN_TO_VENDING_MACHINE_ARTIFACT = {
//   [Token.Keep]: VendingMachineKeep,
//   [Token.Nu]: VendingMachineNuCypher,
// }

export const useVendingMachineContract = (token: UpgredableToken) => {
  // random hardcoded address to avoid local deployment:
  const placeholder = "0x71d82Eb6A5051CfF99582F4CDf2aE9cD402A4883"

  // const vendingMachineArtifact = TOKEN_TO_VENDING_MACHINE_ARTIFACT[token]
  return useContract(
    placeholder,
    undefined
    // vendingMachineArtifact.address,
    // vendingMachineArtifact.abi
  )
}
