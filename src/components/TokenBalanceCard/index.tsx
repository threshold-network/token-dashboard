import { FC } from "react"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import KeepCircleBrand from "../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../static/icons/NuCircleBrand"
import T from "../../static/icons/Ttoken"
import { useToken } from "../../hooks/useToken"
import { tBTCFill } from "../../static/icons/tBTCFill"

export interface TokenBalanceCardProps {
  token: Exclude<Token, Token.TBTC>
  title?: string
}

const tokenToIconMap = {
  [Token.Keep]: KeepCircleBrand,
  [Token.Nu]: NuCircleBrand,
  [Token.T]: T,
  [Token.TBTCV2]: tBTCFill,
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({
  token,
  title = token,
}) => {
  const { balance, usdBalance, contract } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      icon={tokenToIconMap[token]}
      title={title}
      tokenBalance={balance}
      usdBalance={usdBalance}
      contract={contract}
    />
  )
}

export default TokenBalanceCard
