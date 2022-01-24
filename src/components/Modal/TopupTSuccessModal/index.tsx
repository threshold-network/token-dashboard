import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import { StakeData } from "../../../types/staking"

interface TopupTSuccessProps extends BaseModalProps {
  transactionHash: string
  stake: StakeData
  stakeAmount: string | number
}

const TopupTSuccessModal: FC<TopupTSuccessProps> = ({
  transactionHash,
  stake,
  stakeAmount,
}) => {
  const { beneficiary, operator, authorizer } = stake

  return (
    <TransactionSuccessModal
      subTitle="You have successfully topped up your T stake"
      transactionHash={transactionHash}
      body={
        <StakingStats {...{ stakeAmount, beneficiary, operator, authorizer }} />
      }
    />
  )
}

export default withBaseModal(TopupTSuccessModal)
