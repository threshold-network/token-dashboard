import { FC } from "react"
import { H1, BoxProps } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import CardTemplate from "../../Overview/Network/CardTemplate"

export interface CoveragePoolsTVLCardProps extends BoxProps {
  tvl: string
}

export const CoveragePoolsTVLCard: FC<CoveragePoolsTVLCardProps> = ({
  tvl,
  ...restProps
}) => {
  const coveragePoolTVL = formatFiatCurrencyAmount(tvl)
  return (
    <CardTemplate title="COVERAGE POOL TVL" {...restProps}>
      <H1 mt="10" mb="9" textAlign="center">
        {formatFiatCurrencyAmount(coveragePoolTVL)}
      </H1>
    </CardTemplate>
  )
}
