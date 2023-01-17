import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { ModalType, TransactionStatus } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"

export type ContractTransactionFunction =
  | Promise<ContractTransaction>
  | Promise<string>

export const useSendTransactionFromFn = <
  F extends (...args: never[]) => ContractTransactionFunction
>(
  fn: F,
  onSuccess?: (tx: ContractTransaction) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const { account, library } = useWeb3React()
  const { openModal } = useModal()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Idle
  )

  const sendTransaction = useCallback(
    async (...args: Parameters<typeof fn>) => {
      if (!account) {
        // Maybe we should do something here?
        return
      }

      try {
        setTransactionStatus(TransactionStatus.PendingWallet)
        openModal(ModalType.TransactionIsWaitingForConfirmation)
        const tx = await fn(...args)
        let returnedTransaction: ContractTransaction

        if (typeof tx === "string") {
          openModal(ModalType.TransactionIsPending, {
            transactionHash: tx,
          })
          setTransactionStatus(TransactionStatus.PendingOnChain)
          await library.waitForTransaction(tx)
          returnedTransaction = await library.getTransaction(tx)
        } else {
          openModal(ModalType.TransactionIsPending, {
            transactionHash: tx.hash,
          })
          setTransactionStatus(TransactionStatus.PendingOnChain)
          await tx.wait()
          returnedTransaction = tx
        }
        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess) {
          onSuccess(returnedTransaction)
        }
        return returnedTransaction
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
    [fn, account, onError, onSuccess, openModal]
  )

  return { sendTransaction, status: transactionStatus }
}

export const useSendTransaction = (
  contract: Contract,
  methodName: string,
  onSuccess?: (tx: ContractTransaction) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  return useSendTransactionFromFn(contract[methodName], onSuccess, onError)
}
