import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"

interface TopupTSuccessProps extends BaseModalProps {
  transactionHash: string
}

const TopupTSuccessModal: FC<TopupTSuccessProps> = ({ transactionHash }) => {
  return (
    <TransactionSuccessModal
      subTitle="You have successfully topped up your T stake"
      transactionHash={transactionHash}
    />
  )
}

export default withBaseModal(TopupTSuccessModal)
