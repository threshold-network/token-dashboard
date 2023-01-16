import { useWeb3React } from "@web3-react/core"
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
  const { account } = useWeb3React()

  const [
    tBTCDepositData,
    setTBTCDepositData,
    removeTBTCDepositDataFromLocalStorage,
  ] = useLocalStorage<TBTCDepositDataLocalStorage | undefined>(
    `tBTCDepositData-${account}`,
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
