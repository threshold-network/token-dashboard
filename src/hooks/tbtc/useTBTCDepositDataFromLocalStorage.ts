import { useState, useEffect, useCallback } from "react"
import {
  key,
  write,
  removeDataForAccount,
  TBTCDepositData,
  TBTCLocalStorageDepositData,
} from "../../utils/tbtcLocalStorageData"
import { useIsActive } from "../useIsActive"
import { useNonEVMConnection } from "../useNonEVMConnection"

export const useTBTCDepositDataFromLocalStorage = () => {
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName, nonEVMPublicKey, nonEVMChainId } =
    useNonEVMConnection()

  // For StarkNet connections, use the actual connected chain ID
  const effectiveChainId =
    chainId ||
    (isNonEVMActive && nonEVMChainName === "Starknet"
      ? nonEVMChainId
      : undefined)

  const [tBTCDepositData, setTBTCLocalStorageData] =
    useState<TBTCLocalStorageDepositData>({})

  useEffect(() => {
    if (!effectiveChainId) {
      return
    }

    const storageKey = `${key}-${effectiveChainId.toString()}`
    const storedData = localStorage.getItem(storageKey)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    setTBTCLocalStorageData(parsedData)
  }, [effectiveChainId])

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData, chainId?: number | string) => {
      // For StarkNet, we might need to use nonEVMPublicKey as the account
      const effectiveAccount =
        account || (isNonEVMActive ? nonEVMPublicKey : null)

      if (!effectiveAccount || !chainId) {
        return
      }

      const storageKey = `${key}-${chainId.toString()}`
      write(effectiveAccount, depositData, tBTCDepositData, chainId)

      const updatedData = {
        ...tBTCDepositData,
        [effectiveAccount]: depositData,
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, nonEVMPublicKey, isNonEVMActive, tBTCDepositData]
  )

  const removeDepositDataFromLocalStorage = useCallback(
    (chainId?: number | string) => {
      const effectiveAccount =
        account || (isNonEVMActive ? nonEVMPublicKey : null)

      if (!effectiveAccount) return

      const storageKey = `${key}-${chainId?.toString()}`
      removeDataForAccount(effectiveAccount, tBTCDepositData, chainId)

      const updatedData = { ...tBTCDepositData }
      delete updatedData[effectiveAccount]
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, nonEVMPublicKey, isNonEVMActive, tBTCDepositData]
  )

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
