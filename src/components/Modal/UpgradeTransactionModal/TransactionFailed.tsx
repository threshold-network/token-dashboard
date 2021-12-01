import { FC } from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react"
import TransactionError from "../../../static/icons/TransactionError"
import ModalFooter from "./ModalFooter"

interface TransactionFailedProps {
  transactionId?: string
  error: string
  isExpandableError?: boolean
}

const TransactionFailed: FC<TransactionFailedProps> = ({
  transactionId,
  error,
  isExpandableError,
}) => {
  const expandableErrorStyles = isExpandableError
    ? {
        position: "absolute",
        maxW: "calc(100% - 48px)",
        top: "75px",
        h: "250px",
      }
    : {}

  return (
    <>
      <ModalHeader>Error</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box mb={6}>
          <Alert status="error" mb={4} zIndex={999}>
            <HStack>
              <AlertIcon />
              <AlertTitle>{error}</AlertTitle>
            </HStack>
          </Alert>
          <Box borderRadius="md" bg="gray.50" pt={12} pb={8} mb={8}>
            <HStack position="relative" justify="center" mb={8}>
              <TransactionError boxSize="120px" zIndex={0} />
            </HStack>
          </Box>
        </Box>
        <ModalFooter transactionId={transactionId} />
      </ModalBody>
    </>
  )
}

export default TransactionFailed
