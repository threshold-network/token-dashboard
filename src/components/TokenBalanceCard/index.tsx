import { FC } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import Keep from "../../static/icons/Keep"
import Nu from "../../static/icons/Nu"

export interface TokenBalanceCardProps {
  token: Token
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({ token }) => {
  const { keep, nu } = useReduxToken()

  switch (token) {
    case Token.Nu:
      return (
        <TokenBalanceCardTemplate
          icon={Keep}
          title="KEEP"
          tokenBalance={keep.balance}
          usdBalance={keep.usdBalance}
        />
      )
    case Token.Keep:
      return (
        <TokenBalanceCardTemplate
          icon={Nu}
          title="NU"
          tokenBalance={nu.balance}
          usdBalance={nu.usdBalance}
        />
      )
    default:
      return null
  }
}

export default TokenBalanceCard
