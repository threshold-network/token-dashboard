import { FC } from "react"
import { H1, LabelSm, Card } from "@threshold-network/component"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"

const StakingTVLCard: FC<{ tvl: string }> = ({ tvl }) => {
  return (
    <Card>
      <LabelSm mb={8} textTransform="uppercase">
        staking tvl
      </LabelSm>
      <H1 textAlign="center">{formatFiatCurrencyAmount(tvl)}</H1>
    </Card>
  )
}

export default StakingTVLCard
