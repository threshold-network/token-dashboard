import { FC, ComponentProps } from "react"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { Token } from "../../../enums"
import { Card } from "@threshold-network/components"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = (
  ...restProps
) => {
  return (
    <Card>
      <TokenBalanceCard
        token={Token.TBTCV2}
        title={"TBTC Balance"}
        {...restProps}
      />
    </Card>
  )
}
