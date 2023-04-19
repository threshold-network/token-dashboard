import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { H1 } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"

const TotalValueLocked: FC<{ totalValueLocked: number | string }> = ({
  totalValueLocked,
}) => {
  const tvl = formatFiatCurrencyAmount(totalValueLocked)

  return (
    <CardTemplate title="TOTAL VALUE LOCKED">
      <H1 mt="10" mb="9" textAlign="center">
        {tvl}
      </H1>
    </CardTemplate>
  )
}

export default TotalValueLocked
