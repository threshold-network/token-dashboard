import { StackProps } from "@threshold-network/components"
import { ComponentPropsWithoutRef } from "react"
import { RangeOperatorType } from "../../types"

type BaseProps = ComponentPropsWithoutRef<"li"> & StackProps
export type CurrencyType = "BTC" | "ETH" | "tBTC" | "SOL"
type DurationTiersItemProps = {
  amount: number
  currency: CurrencyType
  rangeOperator: RangeOperatorType
}

export interface DurationTiersProps extends BaseProps {
  items: DurationTiersItemProps[]
}
