import { FC } from "react"
import TransactionSuccessModal from "../TransactionSuccessModal"
import StakingStats from "../../StakingStats"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"

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
            amountText: "Unstaked amount",
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
