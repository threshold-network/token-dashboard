import { FC, ComponentProps } from "react"
import Card from "../../../../components/Card"
import { Label3 } from "../../../../components/Typography"

export const MintingTimelineCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label3 mb="5">Minting Timeline</Label3>
    </Card>
  )
}
