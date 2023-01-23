import { FC } from "react"
import { HStack, Icon, Card, LabelSm } from "@threshold-network/components"
import TokenBalance, { TokenBalanceProps } from "../TokenBalance"
// import AddToMetamaskButton from "../AddToMetamaskButton"
import { Contract } from "@ethersproject/contracts"

type Props = {
  icon: any
  title: string | JSX.Element
  tokenBalance: number | string
  contract: Contract | null
} & Pick<
  TokenBalanceProps,
  "tokenDecimals" | "tokenFormat" | "usdBalance" | "withSymbol" | "tokenSymbol"
>

const TokenBalanceCardTemplate: FC<Props> = ({
  icon,
  title,
  tokenBalance,
  usdBalance,
  contract,
  tokenSymbol,
  tokenDecimals,
  tokenFormat,
  withSymbol = false,
  ...restProps
}) => {
  return (
    <Card {...restProps} as="section">
      <HStack as="header" mb="4">
        <Icon boxSize="16px" as={icon} />
        <LabelSm>{title}</LabelSm>
      </HStack>
      <TokenBalance
        tokenAmount={tokenBalance}
        usdBalance={usdBalance}
        tokenSymbol={tokenSymbol}
        withSymbol={withSymbol}
        tokenDecimals={tokenDecimals}
        tokenFormat={tokenFormat}
        withUSDBalance
      />
      {/* <AddToMetamaskButton contract={contract} /> */}
    </Card>
  )
}

export default TokenBalanceCardTemplate
