import { useWeb3React } from "@web3-react/core"
import { useCallback } from "react"
import { useLocalStorage } from "../useLocalStorage"

export type TBTCDepositData = {
  ethAddress: string
  blindingFactor: string
  btcRecoveryAddress: string
  walletPublicKeyHash: string
  refundLocktime: string
  btcDepositAddress: string
}

export type TBTCLocalStorageDepositData = {
  [address: string]: TBTCDepositData
}

export const useTBTCDepositDataFromLocalStorage = () => {
  const { account } = useWeb3React()

  const [tBTCDepositData, setTBTCDepositData] =
    useLocalStorage<TBTCLocalStorageDepositData>(`tBTCDepositData`, {})

  const setDepositDataInLocalStorage = useCallback(
    (depositData: TBTCDepositData) => {
      if (account) {
        const newLocalStorageData = {
          ...tBTCDepositData,
          [account]: depositData,
        }
        setTBTCDepositData(newLocalStorageData)
      }
    },
    [account, setTBTCDepositData]
  )

  const removeDepositDataFromLocalStorage = useCallback(() => {
    const newLocalStorageData = {
      ...tBTCDepositData,
    }
    delete newLocalStorageData[`${account}`]
    setTBTCDepositData(newLocalStorageData)
  }, [account, JSON.stringify(tBTCDepositData), setTBTCDepositData])

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
