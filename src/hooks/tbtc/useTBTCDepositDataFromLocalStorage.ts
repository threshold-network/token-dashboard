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
import { getStarkNetConfig } from "../../utils/tbtcStarknetHelpers"

export const useTBTCDepositDataFromLocalStorage = () => {
  const { account, chainId } = useIsActive()
  const { isNonEVMActive, nonEVMChainName, nonEVMPublicKey } =
    useNonEVMConnection()

  // For StarkNet connections, use the StarkNet chain ID
  const starknetConfig = getStarkNetConfig()
  const effectiveChainId =
    chainId ||
    (isNonEVMActive && nonEVMChainName === "Starknet"
      ? starknetConfig.chainId
      : undefined)

  console.log("useTBTCDepositDataFromLocalStorage - chain detection:", {
    chainId,
    isNonEVMActive,
    nonEVMChainName,
    effectiveChainId,
    starknetConfigChainId: starknetConfig.chainId,
  })

  const [tBTCDepositData, setTBTCLocalStorageData] =
    useState<TBTCLocalStorageDepositData>({})

  useEffect(() => {
    if (!effectiveChainId) {
      console.log("useTBTCDepositDataFromLocalStorage - no effectiveChainId")
      return
    }

    const storageKey = `${key}-${effectiveChainId.toString()}`
    const storedData = localStorage.getItem(storageKey)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    console.log("useTBTCDepositDataFromLocalStorage - loading data:", {
      effectiveChainId,
      storageKey,
      hasData: !!storedData,
      parsedData,
    })

    setTBTCLocalStorageData(parsedData)
  }, [effectiveChainId])

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData, chainId?: number | string) => {
      // For StarkNet, we might need to use nonEVMPublicKey as the account
      const effectiveAccount =
        account || (isNonEVMActive ? nonEVMPublicKey : null)

      if (!effectiveAccount || !chainId) {
        console.log(
          "setDepositDataInLocalStorage - missing account or chainId:",
          {
            account,
            nonEVMPublicKey,
            effectiveAccount,
            chainId,
          }
        )
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

      console.log("setDepositDataInLocalStorage - saved deposit:", {
        account,
        nonEVMPublicKey,
        effectiveAccount,
        chainId,
        storageKey,
        depositData,
      })
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
