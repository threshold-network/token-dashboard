import { FC } from "react"
import { Box, ModalBody, ModalCloseButton, ModalHeader } from "@chakra-ui/react"
import { Body1 } from "../../Typography"
import Spinner from "../../Spinner"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"

interface TransactionIsWaitingFroConfirmationProps extends BaseModalProps {
  pendingText?: string
}

const TransactionIsWaitingForConfirmation: FC<
  TransactionIsWaitingFroConfirmationProps
> = ({ pendingText = "Please confirm the transaction in your wallet" }) => {
  return (
    <>
      <ModalHeader>Confirm (waiting)</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={6}>
          <Box borderRadius="md" bg="gray.50" pt={12} pb={8} mb={8}>
            <Spinner />
            <Body1 color="gray.700" align="center" mt={8}>
              {pendingText}
            </Body1>
          </Box>
        </Box>
      </ModalBody>
    </>
  )
}

export default withBaseModal(TransactionIsWaitingForConfirmation)
