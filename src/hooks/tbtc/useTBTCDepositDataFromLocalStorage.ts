import { useWeb3React } from "@web3-react/core"
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

  const setDepositDataInLocalStorage = (depositData: TBTCDepositData) => {
    if (account) {
      const newLocalStorageData = {
        ...tBTCDepositData,
        [account]: depositData,
      }
      console.log("new local storage data!!!", newLocalStorageData)
      setTBTCDepositData(newLocalStorageData)
    }
  }

  const removeDepositDataFromLocalStorage = () => {
    const newLocalStorageData = {
      ...tBTCDepositData,
    }
    delete newLocalStorageData[`${account}`]
    setTBTCDepositData(newLocalStorageData)
  }

  return {
    tBTCDepositData,
    setDepositDataInLocalStorage,
    removeDepositDataFromLocalStorage,
  }
}
