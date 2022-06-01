import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"

export const SweepTimer: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  return (
    <Card {...props}>
      <Label3 mb="5">Next Sweep</Label3>
    </Card>
  )
}
