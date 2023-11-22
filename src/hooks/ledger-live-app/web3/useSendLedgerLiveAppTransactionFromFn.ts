import { useCallback, useState } from "react"
import { TransactionReceipt } from "@ethersproject/providers"
import { useModal } from "../../../hooks/useModal"
import { TransactionStatus, ModalType } from "../../../enums"
import { isWalletRejectionError } from "../../../utils/isWalletRejectionError"
import { useIsActive } from "../../useIsActive"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { Contract, ContractTransaction } from "@ethersproject/contracts"

type TransactionHashWithAdditionalParams = {
  hash: string
  additionalParams: any
}

export type ContractTransactionFunction =
  | Promise<ContractTransaction>
  | Promise<string>
  | Promise<TransactionHashWithAdditionalParams>

export type OnSuccessCallback = (
  receipt: TransactionReceipt,
  additionalParams?: any[]
) => void | Promise<void>

export type OnErrorCallback = (error: any) => void | Promise<void>

const isTransactionHashWithAdditionalParams = (
  tx: string | ContractTransaction | TransactionHashWithAdditionalParams
): boolean => {
  return typeof tx !== "string" && "additionalParams" in tx
}

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
        const tx = await fn(...args)

        const txHash = typeof tx === "string" ? tx : tx.hash

        openModal(ModalType.TransactionIsPending, {
          transactionHash: txHash,
        })
        setTransactionStatus(TransactionStatus.PendingOnChain)
        const transaction = await signer!.provider?.getTransaction(txHash)
        if (!transaction)
          throw new Error(`Transaction ${transaction} not found!`)
        const txReceipt = await transaction?.wait()

        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess && txReceipt) {
          const additionalParams = isTransactionHashWithAdditionalParams(tx)
            ? (tx as TransactionHashWithAdditionalParams).additionalParams
            : null
          onSuccess(txReceipt, additionalParams)
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
