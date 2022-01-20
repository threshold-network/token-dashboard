import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"

interface UnstakeSuccessProps extends BaseModalProps {
  transactionHash: string
}

const UnstakingSuccessModal: FC<UnstakeSuccessProps> = ({
  transactionHash,
}) => {
  return (
    <TransactionSuccessModal
      subTitle="You have successfully unstaked"
      transactionHash={transactionHash}
    />
  )
}

export default withBaseModal(UnstakingSuccessModal)
