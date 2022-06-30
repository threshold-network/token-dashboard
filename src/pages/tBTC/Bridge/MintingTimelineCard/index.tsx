import { FC, ComponentProps } from "react"
import { Card, LabelSm } from "@threshold-network/components"

export const MintingTimelineCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <LabelSm mb="5">Minting Timeline</LabelSm>
    </Card>
  )
}
