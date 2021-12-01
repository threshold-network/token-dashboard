import { FC } from "react"
import {
  Box,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Spinner,
} from "@chakra-ui/react"
import Threshold from "../../../static/icons/Ttoken"
import ModalFooter from "./ModalFooter"
import { Body1, H5 } from "../../Typography"
import ViewTransactionLink from "./ViewTransactionLink"

interface TransactionPendingProps {
  pendingText: string
  transactionId?: string
  withFooter?: boolean
  modalTitle: string | JSX.Element
  closeBtnText?: string
}

const TransactionPending: FC<TransactionPendingProps> = ({
  pendingText,
  transactionId,
  withFooter,
  modalTitle,
  closeBtnText,
}) => {
  return (
    <>
      <ModalHeader>
        {typeof modalTitle === "string" ? <H5>{modalTitle}</H5> : modalTitle}
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={6}>
          <Box borderRadius="md" bg="gray.50" pt={12} pb={8} mb={8}>
            <HStack position="relative" justify="center" mb={8}>
              <Spinner
                thickness="8px"
                speed="1.3s"
                emptyColor="gray.200"
                color="brand.500"
                height="120px"
                width="120px"
              />
              <Icon
                position="absolute"
                left="163px"
                height="60px"
                w="60px"
                as={Threshold}
              />
            </HStack>
            <Body1 color="gray.700" align="center">
              {pendingText}
            </Body1>
          </Box>

          {!withFooter && transactionId && (
            <ViewTransactionLink transactionId={transactionId} />
          )}
          {withFooter && (
            <ModalFooter
              transactionId={transactionId}
              closeBtnText={closeBtnText}
            />
          )}
        </Box>
      </ModalBody>
    </>
  )
}

export default TransactionPending
