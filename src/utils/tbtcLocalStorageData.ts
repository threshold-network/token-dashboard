import { writeStorage } from "@rehooks/local-storage"

export type Depositor = {
  identifierHex: string
}

export type TBTCDepositData = {
  depositor: Depositor
  chainName: string
  userWalletAddress: string
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
  networkName: string
) {
  if (!account) return

  const newLocalStorageData = {
    ...prevData,
    [account]: newDepositData,
  }

  writeStorage<TBTCLocalStorageDepositData>(
    `${key}-${networkName}`,
    newLocalStorageData
  )
}

export function removeDataForAccount(
  account: string,
  prevData: TBTCLocalStorageDepositData,
  networkName: string
) {
  const newLocalStorageData = {
    ...prevData,
  }
  delete newLocalStorageData[`${account}`]

  writeStorage<TBTCLocalStorageDepositData>(
    `${key}-${networkName}`,
    newLocalStorageData
  )
}
