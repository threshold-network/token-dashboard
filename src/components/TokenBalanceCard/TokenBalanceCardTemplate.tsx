import { FC } from "react"
import { HStack, Icon, Stack } from "@chakra-ui/react"
import { BodySm, Card } from "@threshold-network/components"
import TokenBalance from "../TokenBalance"
// import AddToMetamaskButton from "../AddToMetamaskButton"
import { Contract } from "@ethersproject/contracts"

interface Props {
  icon: any
  title: string
  tokenBalance: number | string
  usdBalance: string
  contract: Contract | null
}

const TokenBalanceCardTemplate: FC<Props> = ({
  icon,
  title,
  tokenBalance,
  usdBalance,
  contract,
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
          withUSDBalance
        />
        {/* <AddToMetamaskButton contract={contract} /> */}
      </Stack>
    </Card>
  )
}

export default TokenBalanceCardTemplate
