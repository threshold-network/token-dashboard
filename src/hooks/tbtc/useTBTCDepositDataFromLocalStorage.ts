import { useWeb3React } from "@web3-react/core"
import { useLocalStorage } from "../useLocalStorage"
import { useTbtcState } from "../useTbtcState"

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
  const { resetDepositData } = useTbtcState()

  const [tBTCDepositData, setTBTCDepositData] =
    useLocalStorage<TBTCLocalStorageDepositData>(`tBTCDepositData`, {})

  const setDepositDataInLocalStorage = (depositData: TBTCDepositData) => {
    if (account) {
      const newLocalStorageData = {
        ...tBTCDepositData,
        [account]: depositData,
      }
      setTBTCDepositData(newLocalStorageData)
    }
  }

  const removeDepositDataFromLocalStorage = () => {
    const newLocalStorageData = {
      ...tBTCDepositData,
    }
    delete newLocalStorageData[`${account}`]
    setTBTCDepositData(newLocalStorageData)
    resetDepositData() // additionaly remove the deposit data from the store
  }

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
