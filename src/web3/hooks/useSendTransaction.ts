import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { ModalType, TransactionStatus } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"
import { TransactionReceipt } from "@ethersproject/providers"
import { useLedgerLiveApp } from "../../contexts/LedgerLiveAppContext"
import { useIsEmbed } from "../../hooks/useIsEmbed"
import { useIsActive } from "../../hooks/useIsActive"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { useNonEVMConnection } from "../../hooks/useNonEVMConnection"
import { isReceipt } from "../../threshold-ts/utils"

type TransactionHashWithAdditionalParams = {
  hash: string
  additionalParams: any
}

export type ContractTransactionFunction =
  | Promise<ContractTransaction>
  | Promise<string | TransactionReceipt>
  | Promise<TransactionHashWithAdditionalParams>

export type OnSuccessCallback = (
  receipt: TransactionReceipt,
  additionalParams?: any[]
) => void | Promise<void>

export type OnErrorCallback = (error: any) => void | Promise<void>

const isContractTransaction = (
  tx: string | ContractTransaction | TransactionHashWithAdditionalParams
): boolean => {
  return typeof tx !== "string" && "wait" in tx
}

const isTransactionHashWithAdditionalParams = (
  tx: string | ContractTransaction | TransactionHashWithAdditionalParams
): boolean => {
  return typeof tx !== "string" && "additionalParams" in tx
}

export const useSendTransactionFromFn = <
  F extends (...args: never[]) => ContractTransactionFunction
>(
  fn: F,
  onSuccess?: OnSuccessCallback,
  onError?: OnErrorCallback,
  pendingText?: string
) => {
  const {
    isBlocked,
    trm: { isFetching },
  } = useSelector((state: RootState) => state.account)
  const { library } = useWeb3React()
  const { account } = useIsActive()
  const { nonEVMPublicKey } = useNonEVMConnection()
  const { openModal } = useModal()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Idle
  )
  const { ledgerLiveAppEthereumSigner: signer } = useLedgerLiveApp()
  const { isEmbed } = useIsEmbed()

  const sendTransaction = useCallback(
    async (...args: Parameters<typeof fn>) => {
      try {
        if ((!nonEVMPublicKey && !account) || isBlocked || isFetching) {
          const errorMessage = `Transaction attempt failed: ${
            isFetching
              ? "We're currently assessing the security details of your wallet, please try again later."
              : isBlocked
              ? "Your wallet has been flagged in our risk assessment screening."
              : "No connected account detected. Please ensure your wallet is connected."
          }`
          throw new Error(errorMessage)
        }

        setTransactionStatus(TransactionStatus.PendingWallet)
        openModal(ModalType.TransactionIsWaitingForConfirmation, {
          pendingText,
        })

        const fnResult = await fn(...args)

        if (isReceipt(fnResult)) {
          if (onSuccess) await onSuccess(fnResult)
          return fnResult // return transaction receipt
        }
        const txHash = typeof fnResult === "string" ? fnResult : fnResult.hash

        openModal(ModalType.TransactionIsPending, { transactionHash: txHash })
        setTransactionStatus(TransactionStatus.PendingOnChain)

        let txReceipt: TransactionReceipt
        if (isEmbed) {
          const transaction = await signer!.provider?.getTransaction(txHash)
          if (!transaction) throw new Error(`Transaction ${txHash} not found!`)
          txReceipt = await transaction.wait()
        } else {
          txReceipt = await (isContractTransaction(fnResult)
            ? (fnResult as ContractTransaction).wait()
            : library.waitForTransaction(txHash))
        }

        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess) {
          const additionalParams = isTransactionHashWithAdditionalParams(
            fnResult
          )
            ? (fnResult as TransactionHashWithAdditionalParams).additionalParams
            : null
          await onSuccess(txReceipt, additionalParams)
        }

        return txReceipt
      } catch (error: any) {
        const status = isWalletRejectionError(error)
          ? TransactionStatus.Rejected
          : TransactionStatus.Failed
        setTransactionStatus(status)

        if (onError) {
          await onError(error)
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
    [
      fn,
      account,
      onError,
      onSuccess,
      openModal,
      isEmbed,
      isBlocked,
      isFetching,
      library,
      signer,
    ]
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
