import { FC } from "react"
import { H1, LabelSm, Card, BoxProps } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"
import {
  StatHighlightCard,
  StatHighlightTitle,
  StatHighlightValue,
} from "../../components/StatHighlightCard"

export interface StakingTvlCardProps extends BoxProps {
  stakingTVL: string
}

const StakingTVLCard: FC<StakingTvlCardProps> = ({
  stakingTVL,
  ...restProps
}) => {
  const formattedStakingTVL = formatFiatCurrencyAmount(stakingTVL)

  return (
    <StatHighlightCard>
      <StatHighlightTitle title={"staking tvl"} />
      <StatHighlightValue value={formattedStakingTVL} />
    </StatHighlightCard>
  )
  return (
    <Card {...restProps}>
      <LabelSm mb={8} textTransform="uppercase">
        staking tvl
      </LabelSm>
      <H1 textAlign="center">{formatFiatCurrencyAmount(stakingTVL)}</H1>
    </Card>
  )
}

export default StakingTVLCard
