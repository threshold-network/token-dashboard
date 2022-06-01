import { FC, ComponentProps } from "react"
import Card from "../../../../components/Card"
import { Label3 } from "../../../../components/Typography"

export const UnmintingCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props}>
      <Label3 mb="5">Unminting Card</Label3>
    </Card>
  )
}
