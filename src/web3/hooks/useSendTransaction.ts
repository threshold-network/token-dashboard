import { useCallback, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import { Contract, ContractTransaction } from "@ethersproject/contracts"
import { isWalletRejectionError } from "../../utils/isWalletRejectionError"
import { TransactionStatus } from "../../enums"
import { getSigner } from "../../utils/getContract"

export const useSendTransaction = (contract: Contract, methodName: string) => {
  const { library, account } = useWeb3React()
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
        console.log("open waiting for confirmation modal")
        // TODO: open modal indicating that the transacion waitng for confirmation.
        // @ts-ignore
        const tx = (await contract[methodName](...args)) as ContractTransaction
        setTransactionStatus(TransactionStatus.PendingOnChain)
        // TODO: open modal indicating that the transacion is pending and pass
        // transaction hash.
        console.log("open transaction is pending modal")
        await tx.wait()
        // TODO: close modal- the correct success modal should be displayed when
        // dapp catches an event.
        console.log("close modal")
        setTransactionStatus(TransactionStatus.Succeeded)
      } catch (error: any) {
        // TODO: open error state modal
        console.log("open error state ")
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
