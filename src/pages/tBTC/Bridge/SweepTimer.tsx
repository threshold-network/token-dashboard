import { FC, ComponentProps } from "react"
import { Card, LabelSm } from "@threshold-network/components"

export const SweepTimer: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <LabelSm mb="5">Next Sweep</LabelSm>
    </Card>
  )
}
