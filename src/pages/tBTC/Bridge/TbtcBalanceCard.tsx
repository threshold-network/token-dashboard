import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props} minH="160px">
      <Label3 mb="5">tBTC Balance</Label3>
    </Card>
  )
}
