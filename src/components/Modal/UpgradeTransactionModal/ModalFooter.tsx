import { Box, Button, HStack } from "@chakra-ui/react"
import { FC } from "react"
import { useModal } from "../../../hooks/useModal"
import ViewTransactionLink from "./ViewTransactionLink"
import { Divider } from "../../Divider"

const ModalFooter: FC<{ transactionId?: string }> = ({ transactionId }) => {
  const { closeModal } = useModal()

  return (
    <Box>
      {transactionId && (
        <>
          <ViewTransactionLink transactionId={transactionId} />
          <Divider mt={4} mb={8} />
        </>
      )}
      <HStack justify="flex-end" mb={4}>
        <Button onClick={closeModal}>Dismiss</Button>
      </HStack>
    </Box>
  )
}

export default ModalFooter
