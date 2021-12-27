import { useEffect } from "react"
import { AddressZero } from "@ethersproject/constants"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { UpgredableToken } from "../../types"
import { isSameETHAddress } from "../../utils/isSameETHAddress"

// Mutex implementation adapted from
// https://spin.atomicobject.com/2018/09/10/javascript-concurrency/
class Mutex {
  private mutex = Promise.resolve()

  lock(): PromiseLike<() => void> {
    let begin: (unlock: () => void) => void = (unlock) => {}

    this.mutex = this.mutex.then(() => {
      return new Promise(begin)
    })

    return new Promise((res) => {
      begin = res
    })
  }
}

const mutex = new Mutex()

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
      const fn = async () => {
        const unlock = await mutex.lock()
        try {
          const ratio = await contract?.ratio()
          setRatio({ value: ratio.toString(), contractAddress })
        } catch (error) {
          unlock()
          console.log("error", error)
        }
      }
      fn()
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
