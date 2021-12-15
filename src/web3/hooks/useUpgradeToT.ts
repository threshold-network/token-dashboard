import { useCallback } from "react"
import { useToken } from "../../hooks/useToken"
import { useSendTransaction } from "./useSendTransaction"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { UpgredableToken } from "../../types"

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
      await sendTransaction(vendingMachineContractAddress, amount, [])
    },
    [sendTransaction, from, vendingMachineContractAddress]
  )

  return { upgradeToT, status }
}
