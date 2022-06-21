import { FC, ComponentProps } from "react"
import { Card, LabelSm } from "@threshold-network/components"

export const TransactionHistory: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props} minH="530px">
      <LabelSm mb="5">tx history</LabelSm>
    </Card>
  )
}
