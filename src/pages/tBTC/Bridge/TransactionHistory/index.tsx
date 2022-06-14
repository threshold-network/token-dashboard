import { FC, ComponentProps } from "react"
import Card from "../../../../components/Card"
import { Label3 } from "../../../../components/Typography"

export const TransactionHistory: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  return (
    <Card {...props} minH="530px">
      <Label3 mb="5">tx history</Label3>
    </Card>
  )
}
