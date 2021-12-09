import { FC } from "react"
import {
  Box,
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
import UpgradeIconGroup from "../../UpgradeIconGroup"
import { Token } from "../../../enums"
import TransactionStats from "./TransactionStats"
import { Divider } from "../../Divider"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"

interface TransactionIdleProps extends BaseModalProps {
  upgradedAmount: number
  receivedAmount: number
  exchangeRate: number
  token: Token
  vendingMachineContractAddress: string
  onSubmit: () => void
}

const TransactionIdle: FC<TransactionIdleProps> = ({
  upgradedAmount,
  receivedAmount,
  exchangeRate,
  token,
  vendingMachineContractAddress,
  onSubmit,
  closeModal,
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
        <Body3>
          This action i reversible via the{" "}
          <ViewInBlockExplorer
            id={vendingMachineContractAddress}
            type={ExplorerDataType.ADDRESS}
            text="vending machine contract."
          />
        </Body3>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>cancel</Button>
        <Button onClick={onSubmit}>upgrade</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIdle)
