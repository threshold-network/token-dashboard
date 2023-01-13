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
  const [
    tBTCDepositData,
    setTBTCDepositData,
    removeTBTCDepositDataFromLocalStorage,
  ] = useLocalStorage<TBTCDepositDataLocalStorage | undefined>(
    "tBTCDepositData",
    undefined
  )

  const setDepositDataInLocalStorage = (
    depositData: TBTCDepositDataLocalStorage
  ) => {
    setTBTCDepositData(depositData)
  }

  const removeDepositDataFromLocalStorage = () => {
    removeTBTCDepositDataFromLocalStorage()
  }

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
