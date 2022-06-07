import { FC } from "react"
import Card from "../../components/Card"
import { H1, Label3 } from "../../components/Typography"
import { formatFiatCurrencyAmount } from "../../utils/formatAmount"

const StakingTVLCard: FC<{ tvl: string }> = ({ tvl }) => {
  return (
    <Card>
      <Label3 mb={8} textTransform="uppercase">
        staking tvl
      </Label3>
      <H1 textAlign="center">{formatFiatCurrencyAmount(tvl)}</H1>
    </Card>
  )
}

export default StakingTVLCard
