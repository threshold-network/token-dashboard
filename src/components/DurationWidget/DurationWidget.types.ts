import { BoxProps } from "@threshold-network/components"
import { RangeOperatorType } from "../../types"
import { CurrencyType } from "../DurationTiers/DurationTiers.types"

export interface DurationWidgetProps extends BoxProps {
  label?: string
  amount: [RangeOperatorType, number, CurrencyType]
}
