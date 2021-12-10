import { useCallback } from "react"
// import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
// import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { Token } from "../../enums"
import { useToken } from "../../hooks/useToken"
import { useSendTransaction } from "./useSendTransaction"

// const TOKEN_TO_VENDING_MACHINE_ARTIFACT = {
//   [Token.Keep]: VendingMachineKeep,
//   [Token.Nu]: VendingMachineNuCypher,
// }

export const useUpgradeToT = (from: Token.Keep | Token.Nu) => {
  const { contract } = useToken(from)
  const { sendTransaction, status } = useSendTransaction(
    contract,
    "approveAndCall"
  )

  const upgradeToT = useCallback(
    async (amount: string) => {
      // const vendingMachineArtifact = TOKEN_TO_VENDING_MACHINE_ARTIFACT[from]
      // await sendTransaction(vendingMachineArtifact.address, amount, [])
    },
    [sendTransaction, from]
  )

  return { upgradeToT, status }
}
