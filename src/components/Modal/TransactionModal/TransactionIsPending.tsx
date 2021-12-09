import { FC } from "react"
import {
  Box,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react"
import { Body1, Body3 } from "../../Typography"
import Spinner from "../../Spinner"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"

interface TransactionIsPendingProps extends BaseModalProps {
  pendingText?: string
  transactionHash: string
}

const TransactionIsPending: FC<TransactionIsPendingProps> = ({
  transactionHash,
  pendingText = "Pending...",
}) => {
  return (
    <>
      <ModalHeader>Confirm (pending)</ModalHeader>
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
      <ModalFooter>
        <Body3>
          <ViewInBlockExplorer
            text="View"
            id={transactionHash}
            type={ExplorerDataType.TRANSACTION}
          />
          transaction on Etherscan
        </Body3>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIsPending)
