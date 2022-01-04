import { useEffect } from "react"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { UpgredableToken } from "../../types"
import { usePrevious } from "@chakra-ui/react"

// The `VendingMachine` ratio is constant and set at construction time so we can
// cache this value in local storage.
export const useVendingMachineRatio = (token: UpgredableToken) => {
  const vendingMachine = useVendingMachineContract(token)
  const prevAddress = usePrevious(vendingMachine?.address)

  const [ratio, setRatio] = useLocalStorage(
    vendingMachine?.address ? `${vendingMachine.address}-ratio` : null,
    ""
  )

  useEffect(() => {
    if (ratio || !vendingMachine || !prevAddress) {
      return
    }

    vendingMachine
      .ratio()
      .then((value: any) => {
        setRatio(value.toString())
      })
      .catch((error: any) => {
        console.log("error", error)
      })
  }, [ratio, setRatio, vendingMachine, prevAddress])

  return ratio
}
