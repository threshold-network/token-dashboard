import { FC, useMemo, useState } from "react"
import { ModalBody, ModalCloseButton, ModalHeader } from "@chakra-ui/react"
import withBaseModal from "../withBaseModal"
import { H5 } from "../../Typography"
import TransactionSuccess from "./TransactionSuccess"

enum TransactionStatus {
  Idle = "IDLE",
  PendingSignature = "PENDING_SIGNATURE",
  PendingApproval = "PENDING_APPROVAL",
  InFlight = "IN_FLIGHT",
  Failed = "FAILED",
  Succeeded = "SUCCEEDED",
}

const UpgradeTransactionModal: FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.Succeeded
  )

  const upgradedAmount = 1000000.68
  const receivedAmount = 4870003.31
  const exchangeRate = 4.87
  const transactionId = "0x_TRANSACTION_ID"

  // TODO: use token enum (or something else)
  const upgradedToken = "KEEP"

  const modalTitle = useMemo(() => {
    switch (transactionStatus) {
      case TransactionStatus.Idle: {
        return "Upgrade Tokens"
      }
      case TransactionStatus.PendingSignature: {
        return "1/2 Sign Approval"
      }
      case TransactionStatus.InFlight: {
        return "TransactionStatus.InFlight"
      }
      case TransactionStatus.Failed: {
        return "TransactionStatus.Failed"
      }
      case TransactionStatus.Succeeded: {
        return "Success"
      }
    }
  }, [transactionStatus])

  const modalBody = useMemo(() => {
    switch (transactionStatus) {
      case TransactionStatus.Idle: {
        return "Upgrade Tokens"
      }
      case TransactionStatus.PendingSignature: {
        return "1/2 Sign Approval"
      }
      case TransactionStatus.InFlight: {
        return "TransactionStatus.InFlight"
      }
      case TransactionStatus.Failed: {
        return "TransactionStatus.Failed"
      }
      case TransactionStatus.Succeeded: {
        return (
          <TransactionSuccess
            upgradedAmount={upgradedAmount}
            receivedAmount={receivedAmount}
            exchangeRate={exchangeRate}
            transactionId={transactionId}
            token={upgradedToken}
          />
        )
      }
    }
  }, [transactionStatus])

  return (
    <>
      <ModalHeader>
        <H5>{modalTitle}</H5>
      </ModalHeader>
      <ModalBody>{modalBody}</ModalBody>
      <ModalCloseButton />
    </>
  )
}
export default withBaseModal(UpgradeTransactionModal)
