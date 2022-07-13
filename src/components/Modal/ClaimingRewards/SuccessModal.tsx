import { FC } from "react"
import { HStack, BodySm, List, ListItem } from "@threshold-network/components"
import TransactionSuccessModal from "../TransactionSuccessModal"
import withBaseModal from "../withBaseModal"
import { formatTokenAmount } from "../../../utils/formatAmount"
import shortenAddress from "../../../utils/shortenAddress"
import { BaseModalProps } from "../../../types"

interface ClaimRewardsSuccessProps extends BaseModalProps {
  transactionHash: string
  totalRewardsAmount: string
  beneficiaries: string[]
}

const ClaimRewardsSuccessModalBase: FC<ClaimRewardsSuccessProps> = ({
  transactionHash,
  totalRewardsAmount,
  beneficiaries,
}) => {
  return (
    <TransactionSuccessModal
      subTitle="Your claim was successful!"
      transactionHash={transactionHash}
      body={
        <List spacing="2">
          <ListItem>
            <HStack justify="space-between">
              <BodySm>Claimed Amount</BodySm>
              <BodySm>{formatTokenAmount(totalRewardsAmount)} T</BodySm>
            </HStack>
          </ListItem>
          {beneficiaries.map((beneficiary) => (
            <ListItem key={beneficiary}>
              <HStack justify="space-between">
                <BodySm>Beneficiary Address</BodySm>
                <BodySm>{shortenAddress(beneficiary)}</BodySm>
              </HStack>
            </ListItem>
          ))}
        </List>
      }
    />
  )
}

export const ClaimRewardsSuccessModal = withBaseModal(
  ClaimRewardsSuccessModalBase
)
