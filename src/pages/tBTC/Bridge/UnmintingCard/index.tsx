import { FC, ComponentProps } from "react"
import { Card, LabelSm } from "@threshold-network/components"

export const UnmintingCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="5">Unminting Card</LabelSm>
    </Card>
  )
}
