import { useEffect } from "react"
import { AddressZero } from "@ethersproject/constants"
import { useVendingMachineContract } from "./useVendingMachineContract"
import { useLocalStorage } from "../../hooks/useLocalStorage"
import { UpgredableToken } from "../../types"
import { isAddressZero, isSameETHAddress } from "../../web3/utils"
import { Token } from "../../enums"

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

const keepMutex = new Mutex()
const nuMutex = new Mutex()

const TOKEN_TO_MUTEX = {
  [Token.Keep]: keepMutex,
  [Token.Nu]: nuMutex,
}

// The `VendingMachine` ratio is constant and set at construction time so we can
// cache this value in local storage.
export const useVendingMachineRatio = (token: UpgredableToken) => {
  const vendingMachine = useVendingMachineContract(token)
  const contractAddress = vendingMachine?.address

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
      (isAddressZero(localStorageContractAddress) ||
        !isSameETHAddress(contractAddress, localStorageContractAddress))
    ) {
      const fn = async () => {
        const mutex = TOKEN_TO_MUTEX[token]
        const unlock = await mutex.lock()
        try {
          const ratio = await vendingMachine?.ratio()
          setRatio({ value: ratio.toString(), contractAddress })
        } catch (error) {
          unlock()
          console.error(`error fetching ${token} VendingMachine ratio`, error)
        }
      }
      fn()
    }
  }, [
    ratioValue,
    localStorageContractAddress,
    setRatio,
    vendingMachine,
    contractAddress,
    token,
  ])

  return ratioValue
}
