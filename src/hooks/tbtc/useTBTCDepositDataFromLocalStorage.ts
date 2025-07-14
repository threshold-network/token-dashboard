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
import { getEthereumNetworkNameFromChainId } from "../../networks/utils"

export const useTBTCDepositDataFromLocalStorage = () => {
  const { account, chainId } = useIsActive()
  const { nonEVMPublicKey, nonEVMChainName } = useNonEVMConnection()

  const networkName =
    nonEVMChainName ?? getEthereumNetworkNameFromChainId(chainId)

  const [tBTCDepositData, setTBTCLocalStorageData] =
    useState<TBTCLocalStorageDepositData>({})

  useEffect(() => {
    const storageKey = `${key}-${networkName?.toString()}`
    const storedData = localStorage.getItem(storageKey)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    setTBTCLocalStorageData(parsedData)
  }, [chainId])

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData, networkName: string) => {
      const connectedAccount = account ?? nonEVMPublicKey
      if (!connectedAccount || !networkName) return

      const storageKey = `${key}-${networkName.toString()}`
      write(connectedAccount, depositData, tBTCDepositData, networkName)

      const updatedData = {
        ...tBTCDepositData,
        [connectedAccount]: depositData,
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, tBTCDepositData, networkName, nonEVMPublicKey]
  )

  const removeDepositDataFromLocalStorage = useCallback(
    (networkName: string) => {
      const connectedAccount = account ?? nonEVMPublicKey
      if (!connectedAccount || !networkName) return

      const storageKey = `${key}-${networkName?.toString()}`
      removeDataForAccount(connectedAccount, tBTCDepositData, networkName)

      const updatedData = { ...tBTCDepositData }
      delete updatedData[connectedAccount]
      localStorage.setItem(storageKey, JSON.stringify(updatedData))
      setTBTCLocalStorageData(updatedData)
    },
    [account, nonEVMPublicKey, tBTCDepositData, chainId]
  )

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
