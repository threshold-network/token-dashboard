import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import { useLocalStorage } from "../useLocalStorage"
import {
  key,
  write,
  removeDataForAccount,
  TBTCDepositData,
  TBTCLocalStorageDepositData,
} from "../../utils/tbtcLocalStorageData"

export const useTBTCDepositDataFromLocalStorage = () => {
  const { account } = useWeb3React()

  const [tBTCDepositData] = useLocalStorage<TBTCLocalStorageDepositData>(
    key,
    {}
  )

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData) => {
      if (!account) return

      write(account, depositData, tBTCDepositData)
    },
    [account, JSON.stringify(tBTCDepositData)]
  )

  const removeDepositDataFromLocalStorage = useCallback(() => {
    if (!account) return

    removeDataForAccount(account, tBTCDepositData)
  }, [account, JSON.stringify(tBTCDepositData)])

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
