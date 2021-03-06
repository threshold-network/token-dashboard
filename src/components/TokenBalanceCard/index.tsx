import { FC } from "react"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import KeepCircleBrand from "../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../static/icons/NuCircleBrand"
import T from "../../static/icons/Ttoken"
import { useToken } from "../../hooks/useToken"

export interface TokenBalanceCardProps {
  token: Exclude<Token, Token.TBTC>
}

const tokenToIconMap = {
  [Token.Keep]: KeepCircleBrand,
  [Token.Nu]: NuCircleBrand,
  [Token.T]: T,
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({ token }) => {
  const { balance, usdBalance, contract } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      icon={tokenToIconMap[token]}
      title={token}
      tokenBalance={balance}
      usdBalance={usdBalance}
      contract={contract}
    />
  )
}

export default TokenBalanceCard
