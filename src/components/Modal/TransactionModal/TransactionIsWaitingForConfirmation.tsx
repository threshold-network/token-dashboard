import { FC } from "react"
import { ModalBody, ModalCloseButton, ModalHeader } from "@chakra-ui/react"
import { Body1 } from "../../Typography"
import Spinner from "../../Spinner"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"

interface Props extends BaseModalProps {
  pendingText?: string
}

const TransactionIsWaitingForConfirmation: FC<Props> = ({
  pendingText = "Please confirm the transaction in your wallet",
}) => {
  return (
    <>
      <ModalHeader>Confirm (waiting)</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox py={12} variant="modal">
          <Spinner />
          <Body1 align="center" mt={8}>
            {pendingText}
          </Body1>
        </InfoBox>
      </ModalBody>
    </>
  )
}

export default withBaseModal(TransactionIsWaitingForConfirmation)
