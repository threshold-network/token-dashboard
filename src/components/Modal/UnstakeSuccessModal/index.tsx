import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import { StakeData } from "../../../types/staking"

interface UnstakeSuccessProps extends BaseModalProps {
  transactionHash: string
  stake: StakeData
  unstakeAmount: string | number
}

const UnstakingSuccessModal: FC<UnstakeSuccessProps> = ({
  transactionHash,
  stake,
  unstakeAmount,
}) => {
  const { beneficiary, stakingProvider, authorizer } = stake

  return (
    <TransactionSuccessModal
      subTitle="Your unstake was successful!"
      transactionHash={transactionHash}
      body={
        <StakingStats
          {...{
            stakeAmount: unstakeAmount,
            beneficiary,
            stakingProvider,
            authorizer,
          }}
        />
      }
    />
  )
}

export default withBaseModal(UnstakingSuccessModal)
