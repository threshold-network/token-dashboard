import { writeStorage } from "@rehooks/local-storage"

export type Depositor = {
  identifierHex: string
}

export type TBTCDepositData = {
  depositor: Depositor
  chainName: string
  ethAddress: string
  blindingFactor: string
  btcRecoveryAddress: string
  walletPublicKeyHash: string
  refundLocktime: string
  btcDepositAddress: string
  extraData?: string
}

export type TBTCLocalStorageDepositData = {
  [address: string]: TBTCDepositData
}

export const key = "tBTCDepositData"

export function write(
  account: string,
  newDepositData: TBTCDepositData,
  prevData: TBTCLocalStorageDepositData,
  chainId?: number | string
) {
  if (!account) return

  const newLocalStorageData = {
    ...prevData,
    [account]: newDepositData,
  }

  writeStorage<TBTCLocalStorageDepositData>(
    `${key}-${chainId?.toString()}`,
    newLocalStorageData
  )
}

export function removeDataForAccount(
  account: string,
  prevData: TBTCLocalStorageDepositData,
  chainId?: number | string
) {
  const newLocalStorageData = {
    ...prevData,
  }
  delete newLocalStorageData[`${account}`]

  writeStorage<TBTCLocalStorageDepositData>(
    `${key}-${chainId?.toString()}`,
    newLocalStorageData
  )
}
