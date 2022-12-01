import { FC } from "react"
import { ModalBody, ModalHeader } from "@chakra-ui/react"
import { BodyLg } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import { ThresholdSpinner } from "../../ThresholdSpinner/ThresholdSpinner"
import ModalCloseButton from "../ModalCloseButton"

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
        <InfoBox variant="modal" paddingY="48px">
          <ThresholdSpinner />
          <BodyLg align="center" mt={8}>
            {pendingText}
          </BodyLg>
        </InfoBox>
      </ModalBody>
    </>
  )
}

export default withBaseModal(TransactionIsWaitingForConfirmation)
