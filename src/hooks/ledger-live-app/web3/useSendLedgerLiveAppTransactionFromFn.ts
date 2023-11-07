import { useCallback, useState } from "react"
import { TransactionReceipt } from "@ethersproject/providers"
import { useModal } from "../../../hooks/useModal"
import { TransactionStatus, ModalType } from "../../../enums"
import { isWalletRejectionError } from "../../../utils/isWalletRejectionError"
import { useIsActive } from "../../useIsActive"
import { useThreshold } from "../../../contexts/ThresholdContext"

export type ContractTransactionFunction = Promise<string>

export type OnSuccessCallback = (
  receipt: TransactionReceipt
) => void | Promise<void>

export type OnErrorCallback = (error: any) => void | Promise<void>

export const useSendLedgerLiveAppTransactionFromFn = <
  F extends (...args: never[]) => ContractTransactionFunction
>(
  fn: F,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
) => {
  const { account } = useIsActive()
  const { openModal } = useModal()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Idle
  )
  const threshold = useThreshold()
  const signer = threshold.config.ethereum.ledgerLiveAppEthereumSigner

  const sendTransaction = useCallback(
    async (...args: Parameters<typeof fn>) => {
      if (!account) {
        // Maybe we should do something here?
        return
      }

      try {
        setTransactionStatus(TransactionStatus.PendingWallet)
        openModal(ModalType.TransactionIsWaitingForConfirmation)
        const txHash = await fn(...args)

        openModal(ModalType.TransactionIsPending, {
          transactionHash: txHash,
        })
        setTransactionStatus(TransactionStatus.PendingOnChain)
        const tx = await signer!.provider?.getTransaction(txHash)
        if (!tx) throw new Error(`Transaction ${txHash} not found!`)
        const txReceipt = await tx?.wait()

        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess && txReceipt) {
          onSuccess(txReceipt)
        }
        return txReceipt
      } catch (error: any) {
        setTransactionStatus(
          isWalletRejectionError(error)
            ? TransactionStatus.Rejected
            : TransactionStatus.Failed
        )

        if (onError) {
          onError(error)
        } else {
          openModal(ModalType.TransactionFailed, {
            transactionHash: error?.transaction?.hash,
            error: error?.message,
            // TODO: how to check if an error is expandable?
            isExpandableError: true,
          })
        }
      }
    },
    [fn, account, onError, onSuccess, openModal, signer]
  )

  return { sendTransaction, status: transactionStatus }
}
