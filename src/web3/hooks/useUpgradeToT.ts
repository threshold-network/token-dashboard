import { useCallback } from "react"
// import VendingMachineKeep from "@threshold-network/solidity-contracts/artifacts/VendingMachineKeep.json"
// import VendingMachineNuCypher from "@threshold-network/solidity-contracts/artifacts/VendingMachineNuCypher.json"
import { Token } from "../../enums"
import { useToken } from "../../hooks/useToken"
import { useSendTransaction } from "./useSendTransaction"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { UpgredableToken } from "../../types"

// const TOKEN_TO_VENDING_MACHINE_ARTIFACT = {
//   [Token.KeepCircleBrand]: VendingMachineKeep,
//   [Token.NuCircleBrand]: VendingMachineNuCypher,
// }

export const useUpgradeToT = (from: UpgredableToken) => {
  const { contract } = useToken(from)
  const vendingMachineContract = useVendingMachineContract(from)
  const vendingMachineContractAddress = vendingMachineContract?.address
  const { sendTransaction, status } = useSendTransaction(
    contract!,
    "approveAndCall"
  )

  const upgradeToT = useCallback(
    async (amount: string) => {
      // const vendingMachineArtifact = TOKEN_TO_VENDING_MACHINE_ARTIFACT[from]
      // await sendTransaction(vendingMachineArtifact.address, amount, [])
      await sendTransaction(vendingMachineContractAddress, amount, [])
    },
    [sendTransaction, from, vendingMachineContractAddress]
  )

  return { upgradeToT, status }
}
