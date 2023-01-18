import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { ModalType, TransactionStatus } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"
import { TransactionReceipt } from "@ethersproject/providers"

export type ContractTransactionFunction =
  | Promise<ContractTransaction>
  | Promise<string>

export type OnSuccessCallback = (
  receipt: TransactionReceipt
) => void | Promise<void>

export type OnErrorCallback = (error: any) => void | Promise<void>

export const useSendTransactionFromFn = <
  F extends (...args: never[]) => ContractTransactionFunction
>(
  fn: F,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback
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

        const txHash = typeof tx === "string" ? tx : tx.hash
        openModal(ModalType.TransactionIsPending, {
          transactionHash: txHash,
        })
        setTransactionStatus(TransactionStatus.PendingOnChain)

        const txReceipt = (await (typeof tx === "string"
          ? library.waitForTransaction(tx)
          : tx.wait())) as TransactionReceipt

        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess) {
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
    [fn, account, onError, onSuccess, openModal]
  )

  return { sendTransaction, status: transactionStatus }
}

export const useSendTransaction = (
  contract: Contract,
  methodName: string,
  onSuccess?: (tx: TransactionReceipt) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  return useSendTransactionFromFn(contract[methodName], onSuccess, onError)
}
