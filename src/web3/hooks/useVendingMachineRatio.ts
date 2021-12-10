import { useEffect } from "react"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { UpgredableToken } from "../../types"
import { usePrevious } from "@chakra-ui/react"

// The `VendingMachine` ratio is constant and set at construction time so we can
// cache this value in local storage.
export const useVendingMachineRatio = (token: UpgredableToken) => {
  const contract = useVendingMachineContract(token)
  const prevAddress = usePrevious(contract?.address)

  const [ratio, setRatio] = useLocalStorage(
    contract?.address ? `${contract.address}-ratio` : null,
    ""
  )

  useEffect(() => {
    if (ratio || !contract || !prevAddress) {
      return
    }

    contract
      .ratio()
      .then((value: any) => {
        setRatio(value.toString())
      })
      .catch((error: any) => {
        console.log("error", error)
      })
  }, [ratio, setRatio, contract, prevAddress])

  return ratio
}
