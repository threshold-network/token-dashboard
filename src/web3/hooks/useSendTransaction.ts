import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { ModalType, TransactionStatus } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { getSigner } from "../../utils/getContract"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"

export const useSendTransaction = (
  contract: Contract,
  methodName: string,
  onSuccess?: (tx: ContractTransaction) => void | Promise<void>,
  onError?: (error: any) => void | Promise<void>
) => {
  const { library, account } = useWeb3React()
  const { openModal } = useModal()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Idle
  )

  const sendTransaction = useCallback(
    async (...args) => {
      if (!account || !contract[methodName]) {
        // Maybe we should do something here?
        return
      }

      try {
        contract.connect(getSigner(library, account))
        setTransactionStatus(TransactionStatus.PendingWallet)
        openModal(ModalType.TransactionIsWaitingForConfirmation)
        const tx = (await contract[methodName](...args)) as ContractTransaction
        openModal(ModalType.TransactionIsPending, { transactionHash: tx.hash })
        setTransactionStatus(TransactionStatus.PendingOnChain)
        await tx.wait()
        setTransactionStatus(TransactionStatus.Succeeded)
        if (onSuccess) {
          onSuccess(tx)
        }
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
            error,
            // TODO: how to check if an error is expandable?
            isExpandableError: true,
          })
        }
      }
    },
    [contract, methodName, library, account]
  )

  return { sendTransaction, status: transactionStatus }
}
