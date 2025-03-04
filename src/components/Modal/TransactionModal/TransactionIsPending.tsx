import { FC } from "react"
import { Box, ModalBody, ModalHeader, ModalFooter } from "@chakra-ui/react"
import { BodyLg, BodySm } from "@threshold-network/components"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../networks/enums/networks"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import { ThresholdSpinner } from "../../ThresholdSpinner/ThresholdSpinner"
import ModalCloseButton from "../ModalCloseButton"
import { useIsActive } from "../../../hooks/useIsActive"

interface TransactionIsPendingProps extends BaseModalProps {
  pendingText?: string
  transactionHash: string
}

const TransactionIsPending: FC<TransactionIsPendingProps> = ({
  transactionHash,
  pendingText = "Pending...",
}) => {
  const { chainId } = useIsActive()

  return (
    <>
      <ModalHeader>Confirm (pending)</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox py={12} variant="modal">
          <ThresholdSpinner />
          <BodyLg align="center" mt={8}>
            {pendingText}
          </BodyLg>
        </InfoBox>
      </ModalBody>
      <ModalFooter justifyContent="center">
        <BodySm>
          <ViewInBlockExplorer
            text="View"
            id={transactionHash}
            type={ExplorerDataType.TRANSACTION}
            ethereumNetworkChainId={chainId}
          />{" "}
          transaction on Etherscan
        </BodySm>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIsPending)
