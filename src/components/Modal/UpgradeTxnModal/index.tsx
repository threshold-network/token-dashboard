import {
  Alert,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react"
import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { H5 } from "../../Typography"
import { useKeep } from "../../../web3/hooks/useKeep"
import { useTransaction } from "../../../hooks/useTransaction"
import { TransactionStatus } from "../../../enums/transactionType"

const UpgradeTransactionModal: FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const { approveKeep } = useKeep()
  const { keepApproval } = useTransaction()

  const approveErc20 = () => {
    approveKeep()
  }

  return (
    <>
      <ModalHeader>
        <H5>Upgrade to T</H5>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {keepApproval.status === TransactionStatus.Succeeded && (
          <Alert status="success">Keep has been approved</Alert>
        )}

        {keepApproval.status === TransactionStatus.Failed && (
          <Alert status="error">Txn has failed</Alert>
        )}

        <Button
          isLoading={
            keepApproval.status === TransactionStatus.PendingWallet ||
            keepApproval.status === TransactionStatus.PendingOnChain
          }
          onClick={approveErc20}
          loadingText={
            keepApproval.status === TransactionStatus.PendingWallet
              ? "Please confirm with your wallet"
              : "Approval pending..."
          }
        >
          Approve ERC20
        </Button>
      </ModalBody>
    </>
  )
}
export default withBaseModal(UpgradeTransactionModal)
