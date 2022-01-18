import { FC } from "react"
import UpgradeStats from "./UpgradeStats"
import { useTExchangeRate } from "../../../hooks/useTExchangeRate"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, UpgredableToken } from "../../../types"
import TransactionSuccessModal from "../TransactionSuccessModal"

interface UpgradeSuccessProps extends BaseModalProps {
  upgradedAmount: string
  receivedAmount: string
  transactionHash: string
  token: UpgredableToken
}

const UpgradeSuccess: FC<UpgradeSuccessProps> = ({
  upgradedAmount,
  receivedAmount,
  transactionHash,
  token,
}) => {
  const { formattedAmount: exchangeRate } = useTExchangeRate(token)

  return (
    <TransactionSuccessModal
      subTitle="Your upgrade was successful!"
      transactionHash={transactionHash}
      body={
        <UpgradeStats
          token={token}
          exchangeRate={exchangeRate}
          receivedAmount={receivedAmount}
          upgradedAmount={upgradedAmount}
        />
      }
    />
  )
}

export default withBaseModal(UpgradeSuccess)
