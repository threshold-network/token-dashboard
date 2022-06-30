import { FC, ComponentProps } from "react"
import { Card, LabelSm } from "@threshold-network/components"

export const TbtcFeeCalculator: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="5">Fee Calculator</LabelSm>
    </Card>
  )
}
