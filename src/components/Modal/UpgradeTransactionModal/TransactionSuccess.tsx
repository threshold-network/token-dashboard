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

interface TransactionSuccessProps {
  upgradedAmount: number
  receivedAmount: number
  exchangeRate: number
  transactionId: string
  token: string
}

const TransactionSuccess: FC<TransactionSuccessProps> = ({
  upgradedAmount,
  receivedAmount,
  exchangeRate,
  transactionId,
  token,
}) => {
  const transactionInfo = [
    {
      text: "Upgrade Amount",
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: `${numeral(upgradedAmount).format("0,00.00")} ${token}`,
    },
    {
      text: "Receive Amount",
      value: `${numeral(receivedAmount).format("0,00.00")} T`,
    },
    {
      text: "Exchange Rate",
      value: `1 ${token} = ${exchangeRate} T`,
    },
  ]

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

          <Stack spacing={4} mb={12}>
            {transactionInfo.map((info) => (
              <HStack justify="space-between" key={info.text}>
                <Body3 color="gray.500">{info.text}</Body3>
                <Body3 color="gray.700">{info.value}</Body3>
              </HStack>
            ))}
          </Stack>

          <ModalFooter transactionId={transactionId} />
        </Box>
      </ModalBody>
    </>
  )
}

export default TransactionSuccess
