import { FC } from "react"
import { H1, LabelSm, Card, BoxProps } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"
import {
  StatHighlightCard,
  StatHighlightTitle,
  StatHighlightValue,
} from "../../components/StatHighlightCard"

export interface StakingTvlCardProps extends BoxProps {
  stakingTvl: string
}

const StakingTvlCard: FC<StakingTvlCardProps> = ({
  stakingTvl,
  ...restProps
}) => {
  const formattedStakingTvl = formatFiatCurrencyAmount(stakingTvl)

  return (
    <StatHighlightCard>
      <StatHighlightTitle title={"staking tvl"} />
      <StatHighlightValue value={formattedStakingTvl} />
    </StatHighlightCard>
  )
  return (
    <Card {...restProps}>
      <LabelSm mb={8} textTransform="uppercase">
        staking tvl
      </LabelSm>
      <H1 textAlign="center">{formatFiatCurrencyAmount(stakingTvl)}</H1>
    </Card>
  )
}

export default StakingTvlCard
