import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { ModalType, TransactionStatus } from "../../enums"
import { useModal } from "../../hooks/useModal"
import { getSigner } from "../../utils/getContract"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"

export const useSendTransaction = (contract: Contract, methodName: string) => {
  const { library, account } = useWeb3React()
  const { openModal } = useModal()
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Idle
  )

  const sendTransaction = useCallback(
    async (...args) => {
      if (!account) {
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
        // TODO: close modal- the correct success modal should be displayed when
        // dapp catches an event. We should close modals by id to avoid race
        // between close and open action.
        setTransactionStatus(TransactionStatus.Succeeded)
      } catch (error: any) {
        openModal(ModalType.TransactionFailed, {
          transactionHash: error?.transaction?.hash,
          error,
          // TODO: how to check if an error is expandable?
          // isExpandableError,
        })
        setTransactionStatus(
          isWalletRejectionError(error)
            ? TransactionStatus.Rejected
            : TransactionStatus.Failed
        )
      }
    },
    [contract, methodName, library, account]
  )

  return { sendTransaction, status: transactionStatus }
}
