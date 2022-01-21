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
import InfoBox from "../../InfoBox"

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
        <InfoBox py={12} variant="modal">
          <Spinner />
          <Body1 align="center" mt={8}>
            {pendingText}
          </Body1>
        </InfoBox>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <Body3>
          <ViewInBlockExplorer
            text="View"
            id={transactionHash}
            type={ExplorerDataType.TRANSACTION}
          />{" "}
          transaction on Etherscan
        </Body3>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIsPending)
