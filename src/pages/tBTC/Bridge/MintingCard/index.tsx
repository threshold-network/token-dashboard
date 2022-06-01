import { FC, ComponentProps } from "react"
import Card from "../../../../components/Card"
import { Label3 } from "../../../../components/Typography"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Label3 mb="5">Minting Card</Label3>
    </Card>
  )
}
