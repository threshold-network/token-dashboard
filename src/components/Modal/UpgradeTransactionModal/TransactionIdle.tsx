import React, { FC } from "react"
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
import { Body1, H5 } from "../../Typography"
import UpgradeIconGroup from "../../UpgradeIconGroup"
import { Token } from "../../../enums"
import TransactionStats from "./TransactionStats"
import { Divider } from "../../Divider"

interface TransactionIdleProps {
  upgradedAmount: number
  receivedAmount: number
  exchangeRate: number
  transactionId: string
  token: Token
}

const TransactionIdle: FC<TransactionIdleProps> = ({
  upgradedAmount,
  receivedAmount,
  exchangeRate,
  transactionId,
  token,
}) => {
  return (
    <>
      <ModalHeader>Upgrade Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box borderRadius="md" bg="gray.50" padding={6}>
          <H5>You are about to upgrade {token} to T.</H5>
          <Body1>
            The upgrade uses an ApproveAndCall function which requires one
            confirmation transaction
          </Body1>
        </Box>
        <HStack justifyContent="center" my={6}>
          <UpgradeIconGroup token={token} boxSize="48px" />
        </HStack>
        <Divider />
        <TransactionStats
          token={token}
          exchangeRate={exchangeRate}
          receivedAmount={receivedAmount}
          upgradedAmount={upgradedAmount}
        />
        <ModalFooter transactionId={transactionId} />
      </ModalBody>
    </>
  )
}

export default TransactionIdle
