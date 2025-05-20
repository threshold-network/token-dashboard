import { useState, useEffect, useCallback } from "react"
import {
  key,
  write,
  removeDataForAccount,
  TBTCDepositData,
  TBTCLocalStorageDepositData,
} from "../../utils/tbtcLocalStorageData"
import { useIsActive } from "../useIsActive"

export const useTBTCDepositDataFromLocalStorage = () => {
  const isTemporarilyDisabled = true // TODO: remove this
  const { account, chainId } = useIsActive()

  const [tBTCDepositData, setTBTCLocalStorageData] =
    useState<TBTCLocalStorageDepositData>({})

  useEffect(() => {
    if (isTemporarilyDisabled) return

    const storageKey = `${key}-${chainId?.toString()}`
    const storedData = localStorage.getItem(storageKey)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    setTBTCLocalStorageData(parsedData)
  }, [chainId])

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData, chainId?: number | string) => {
      if (!account || !chainId) return

      const storageKey = `${key}-${chainId.toString()}`
      write(account, depositData, tBTCDepositData, chainId)

      const updatedData = {
        ...tBTCDepositData,
        [account]: depositData,
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, tBTCDepositData, chainId]
  )

  const removeDepositDataFromLocalStorage = useCallback(
    (chainId?: number | string) => {
      if (!account) return

      const storageKey = `${key}-${chainId?.toString()}`
      removeDataForAccount(account, tBTCDepositData, chainId)

      const updatedData = { ...tBTCDepositData }
      delete updatedData[account]
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, tBTCDepositData, chainId]
  )

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
