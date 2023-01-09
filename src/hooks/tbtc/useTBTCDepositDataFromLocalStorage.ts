import { deleteFromStorage } from "@rehooks/local-storage"
import { useLocalStorage } from "../useLocalStorage"

export type TBTCDepositDataLocalStorage = {
  ethAddress: string
  blindingFactor: string
  btcRecoveryAddress: string
  walletPublicKeyHash: string
  refundLocktime: string
  btcDepositAddress: string
}

export const useTBTCDepositDataFromLocalStorage = () => {
  const [tBTCDepositData, setTBTCDepositData] = useLocalStorage<
    TBTCDepositDataLocalStorage | undefined
  >("tBTCDepositData", undefined)

  const setDepositDataInLocalStorage = (
    depositData: TBTCDepositDataLocalStorage
  ) => {
    setTBTCDepositData(depositData)
  }

  const removeDepositDataFromLocalStorage = () => {
    deleteFromStorage("tBTCDepositData")
  }

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
