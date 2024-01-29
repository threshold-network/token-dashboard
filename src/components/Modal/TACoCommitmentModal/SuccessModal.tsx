import { FC } from "react"
import { HStack, BodySm, List, ListItem } from "@threshold-network/components"
import TransactionSuccessModal from "../TransactionSuccessModal"
import withBaseModal from "../withBaseModal"
import { formatTokenAmount } from "../../../utils/formatAmount"
import shortenAddress from "../../../utils/shortenAddress"
import { BaseModalProps } from "../../../types"

interface TACoCommitmentSuccessProps extends BaseModalProps {
  transactionHash: string
  authorizedAmount: string
}

const TACoCommitmentSuccessModalBase: FC<TACoCommitmentSuccessProps> = ({
  transactionHash,
  authorizedAmount,
}) => {
  return (
    <TransactionSuccessModal
      subTitle="Your commitment was successful!"
      transactionHash={transactionHash}
      body={
        <List spacing="2">
          <ListItem>
            <HStack justify="space-between">
              <BodySm>Total Amount</BodySm>
              <BodySm>{formatTokenAmount(authorizedAmount)} T</BodySm>
            </HStack>
          </ListItem>
        </List>
      }
    />
  )
}

export const TACoCommitmentSuccessModal = withBaseModal(
  TACoCommitmentSuccessModalBase
)
