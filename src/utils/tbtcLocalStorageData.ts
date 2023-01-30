import { writeStorage } from "@rehooks/local-storage"

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

export const key = "tBTCDepositData"

export function write(
  account: string,
  newDepositData: TBTCDepositData,
  prevData: TBTCLocalStorageDepositData
) {
  if (!account) return

  const newLocalStorageData = {
    ...prevData,
    [account]: newDepositData,
  }

  writeStorage<TBTCLocalStorageDepositData>(key, newLocalStorageData)
}

export function removeDataForAccount(
  account: string,
  prevData: TBTCLocalStorageDepositData
) {
  const newLocalStorageData = {
    ...prevData,
  }
  delete newLocalStorageData[`${account}`]

  writeStorage<TBTCLocalStorageDepositData>(key, newLocalStorageData)
}
