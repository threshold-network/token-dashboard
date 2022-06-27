import { FC, ComponentProps } from "react"
import Card from "../../../components/Card"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { Token } from "../../../enums"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = () => {
  return <TokenBalanceCard token={Token.TBTCV2} title={"TBTC Balance"} />
}
