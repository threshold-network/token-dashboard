import { useEffect } from "react"
import { AddressZero } from "@ethersproject/constants"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { UpgredableToken } from "../../types"
import { isSameETHAddress } from "../../utils/isSameETHAddress"

// The `VendingMachine` ratio is constant and set at construction time so we can
// cache this value in local storage.
export const useVendingMachineRatio = (token: UpgredableToken) => {
  const contract = useVendingMachineContract(token)
  const contractAddress = contract?.address

  const [ratio, setRatio] = useLocalStorage(`${token}-to-T-ratio`, {
    value: "0",
    contractAddress: AddressZero,
  })

  const { value: ratioValue, contractAddress: localStorageContractAddress } =
    ratio

  useEffect(() => {
    if (
      ratioValue === "0" &&
      contractAddress &&
      (localStorageContractAddress === AddressZero ||
        !isSameETHAddress(contractAddress, localStorageContractAddress))
    ) {
      contract
        ?.ratio()
        .then((value: any) => {
          setRatio({ value: value.toString(), contractAddress })
        })
        .catch((error: any) => {
          console.log("error", error)
        })
    }
  }, [
    ratioValue,
    localStorageContractAddress,
    setRatio,
    contract,
    contractAddress,
  ])

  return ratioValue
}
