import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Box,
  HStack,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import Threshold from "../../../static/icons/Ttoken"
import ModalFooter from "./ModalFooter"
import Confetti from "react-confetti"
import numeral from "numeral"
import { Body3, H5 } from "../../Typography"
import { Token } from "../../../enums"
import TransactionStats from "./TransactionStats"

interface TransactionSuccessProps {
  upgradedAmount: number
  receivedAmount: number
  exchangeRate: number
  transactionId: string
  token: Token
}

const TransactionSuccess: FC<TransactionSuccessProps> = ({
  upgradedAmount,
  receivedAmount,
  exchangeRate,
  transactionId,
  token,
}) => {
  return (
    <>
      <ModalHeader>
        <H5>Success</H5>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box>
          <Alert status="success" mb={4}>
            <AlertIcon />
            Your upgrade was successful
          </Alert>
          <HStack
            borderRadius="md"
            bg="gray.50"
            justify="center"
            py={12}
            position="relative"
            mb={8}
          >
            <Box position="absolute" left="-20px" top="-25px" zindex="-1">
              <Confetti
                width={440}
                height={250}
                confettiSource={{ x: 200, y: 40, h: 100, w: 100 }}
                numberOfPieces={50}
              />
            </Box>
            <Icon zIndex={999} height="105px" w="105px" as={Threshold} />
          </HStack>

          <TransactionStats
            token={token}
            exchangeRate={exchangeRate}
            receivedAmount={receivedAmount}
            upgradedAmount={upgradedAmount}
          />

          <ModalFooter transactionId={transactionId} />
        </Box>
      </ModalBody>
    </>
  )
}

export default TransactionSuccess
