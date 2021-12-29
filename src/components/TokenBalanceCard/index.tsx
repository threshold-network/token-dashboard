import { FC } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import Keep from "../../static/icons/Keep"
import Nu from "../../static/icons/Nu"
import T from "../../static/icons/Ttoken"
import { useToken } from "../../hooks/useToken"

export interface TokenBalanceCardProps {
  token: Exclude<Token, Token.TBTC>
}

const tokenToIconMap = {
  [Token.Keep]: Keep,
  [Token.Nu]: Nu,
  [Token.T]: T,
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({ token }) => {
  const { balance, usdBalance } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      icon={tokenToIconMap[token]}
      title={token}
      tokenBalance={balance}
      usdBalance={usdBalance}
    />
  )
}

export default TokenBalanceCard
