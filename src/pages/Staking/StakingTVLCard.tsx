import { FC } from "react"
import { H1, LabelSm, Card, BoxProps } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"

export interface StakingTvlCardProps extends BoxProps {
  tvl: string
}

const StakingTVLCard: FC<StakingTvlCardProps> = ({ tvl, ...restProps }) => {
  return (
    <Card {...restProps}>
      <LabelSm mb={8} textTransform="uppercase">
        staking tvl
      </LabelSm>
      <H1 textAlign="center">{formatFiatCurrencyAmount(tvl)}</H1>
    </Card>
  )
}

export default StakingTVLCard
