import { BoxProps } from "@threshold-network/components"
import { RangeOperatorType, CurrencyType } from "../../types"

export interface DurationWidgetProps extends BoxProps {
  label?: string
  amount: [RangeOperatorType, number, CurrencyType]
}
