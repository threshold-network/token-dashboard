import { StackProps } from "@threshold-network/components"
import { ComponentPropsWithoutRef } from "react"
import { RangeOperatorType, CurrencyType } from "../../types"

type BaseProps = ComponentPropsWithoutRef<"li"> & StackProps
type MintDurationTiersItemProps = {
  amount: number
  currency: CurrencyType
  rangeOperator: RangeOperatorType
}

export interface MintDurationTiersProps extends BaseProps {
  items: MintDurationTiersItemProps[]
}
