import { FC } from "react"
import { Token } from "../../enums"
import TokenBalanceCardTemplate from "./TokenBalanceCardTemplate"
import KeepCircleBrand from "../../static/icons/KeepCircleBrand"
import NuCircleBrand from "../../static/icons/NuCircleBrand"
import T from "../../static/icons/Ttoken"
import { useToken } from "../../hooks/useToken"
import { tBTCFillBlack } from "../../static/icons/tBTCFillBlack"

export interface TokenBalanceCardProps {
  token: Exclude<Token, Token.TBTC>
  title?: string | JSX.Element
  tokenSymbol?: string
  withSymbol?: boolean
}

const tokenToIconMap = {
  [Token.Keep]: KeepCircleBrand,
  [Token.Nu]: NuCircleBrand,
  [Token.T]: T,
  [Token.TBTCV2]: tBTCFillBlack,
}

const TokenBalanceCard: FC<TokenBalanceCardProps> = ({
  token,
  title = token,
  tokenSymbol,
  withSymbol = false,
  ...restProps
}) => {
  const { balance, usdBalance, contract, decimals } = useToken(token)

  return (
    <TokenBalanceCardTemplate
      icon={tokenToIconMap[token]}
      title={title}
      tokenBalance={balance}
      usdBalance={usdBalance}
      contract={contract}
      tokenSymbol={tokenSymbol}
      withSymbol={withSymbol}
      tokenDecimals={decimals}
      {...restProps}
    />
  )
}

export default TokenBalanceCard
