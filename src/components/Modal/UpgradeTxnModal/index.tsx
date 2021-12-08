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
import { TransactionStatus } from "../../../enums/transactionType"
import { useUpgradeToT } from "../../../web3/hooks/useUpgradeToT"
import { Token } from "../../../enums"

const UpgradeTxnModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { upgradeToT, status } = useUpgradeToT(Token.Keep)

  return (
    <>
      <ModalHeader>
        <H5>Upgrade to T</H5>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {status === TransactionStatus.Succeeded && (
          <Alert status="success">Keep has been approved</Alert>
        )}

        {status === TransactionStatus.Failed && (
          <Alert status="error">Txn has failed</Alert>
        )}

        <Button
          isLoading={
            status === TransactionStatus.PendingWallet ||
            status === TransactionStatus.PendingOnChain
          }
          onClick={async () => {
            await upgradeToT("1000000000000000000")
          }}
          loadingText={
            status === TransactionStatus.PendingWallet
              ? "Please confirm with your wallet"
              : "Approval pending..."
          }
        >
          Upgrade To T
        </Button>
      </ModalBody>
    </>
  )
}
export default withBaseModal(UpgradeTxnModal)
