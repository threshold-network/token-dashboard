import { FC } from "react"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import {
  StatHighlightCard,
  StatHighlightTitle,
  StatHighlightValue,
} from "../../../components/StatHighlightCard"

const TotalValueLocked: FC<{ totalValueLocked: number | string }> = ({
  totalValueLocked,
}) => {
  const tvl = formatFiatCurrencyAmount(totalValueLocked)

  return (
    <StatHighlightCard>
      <StatHighlightTitle title={"total value locked"} />
      <StatHighlightValue value={tvl} />
    </StatHighlightCard>
  )
}

export default TotalValueLocked
