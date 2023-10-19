import { StackProps } from "@threshold-network/components"
import { ComponentPropsWithoutRef } from "react"
import { RangeOperatorType, CurrencyType } from "../../types"

type BaseProps = ComponentPropsWithoutRef<"li"> & StackProps
type DurationTiersItemProps = {
  amount: number
  currency: CurrencyType
  rangeOperator: RangeOperatorType
}

export interface DurationTiersProps extends BaseProps {
  items: DurationTiersItemProps[]
}
