import { FC, ComponentProps } from "react"
import { LabelSm, Card } from "@threshold-network/components"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props} minH="160px">
      <LabelSm mb="5">tBTC Balance</LabelSm>
    </Card>
  )
}
