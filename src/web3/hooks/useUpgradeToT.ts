import { Token } from "../../enums"
//@ts-ignore
import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
//@ts-ignore
import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { useToken } from "../../hooks/useToken"

const TOKEN_TO_VENDING_MACHINE_ARTIFACT = {
  [Token.Keep]: VendingMachineKeep,
  [Token.Nu]: VendingMachineNuCypher,
}

export const useUpgradeToT = (from: Token.Keep | Token.Nu) => {
  const { contract } = useToken(from)

  const upgradeToT = async (amount: string) => {
    const vendingMachineArtifact = TOKEN_TO_VENDING_MACHINE_ARTIFACT[from]
    try {
      const tx = await contract?.approveAndCall(
        vendingMachineArtifact.address,
        amount,
        []
      )
      await tx.wait(1)
      console.log("Sucessfull transaction")
    } catch (error: any) {
      console.log("error", error)
    }
  }

  return upgradeToT
}
