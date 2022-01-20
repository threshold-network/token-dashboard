import { FC } from "react"
import StakingStats from "./StakingStats"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { useStakingState } from "../../../hooks/useStakingState"
import TransactionSuccessModal from "../TransactionSuccessModal"

interface StakingSuccessProps extends BaseModalProps {
  transactionHash: string
}

const StakingSuccessModal: FC<StakingSuccessProps> = ({ transactionHash }) => {
  const { stakeAmount, operator, beneficiary, authorizer } = useStakingState()

  return (
    <TransactionSuccessModal
      subTitle="Your stake was successful!"
      transactionHash={transactionHash}
      body={
        <StakingStats {...{ stakeAmount, beneficiary, operator, authorizer }} />
      }
    />
  )
}

export default withBaseModal(StakingSuccessModal)
