import { FC } from "react"
import { HStack, Icon, Stack } from "@chakra-ui/react"
import { BodySm, Card } from "@threshold-network/components"
import TokenBalance from "../TokenBalance"
// import AddToMetamaskButton from "../AddToMetamaskButton"
import { Contract } from "@ethersproject/contracts"

interface Props {
  icon: any
  title: string | JSX.Element
  tokenBalance: number | string
  usdBalance: string
  contract: Contract | null
  tokenSymbol?: string
  withSymbol?: boolean
}

const TokenBalanceCardTemplate: FC<Props> = ({
  icon,
  title,
  tokenBalance,
  usdBalance,
  contract,
  tokenSymbol,
  withSymbol = false,
  ...restProps
}) => {
  return (
    <Card {...restProps}>
      <Stack>
        <HStack>
          <Icon boxSize="16px" as={icon} />
          <BodySm>{title}</BodySm>
        </HStack>
        <TokenBalance
          tokenAmount={tokenBalance}
          usdBalance={usdBalance}
          tokenSymbol={tokenSymbol}
          withSymbol={withSymbol}
          withUSDBalance
        />
        {/* <AddToMetamaskButton contract={contract} /> */}
      </Stack>
    </Card>
  )
}

export default TokenBalanceCardTemplate
