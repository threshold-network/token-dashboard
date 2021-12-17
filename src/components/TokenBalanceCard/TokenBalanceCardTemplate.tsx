import { FC } from "react"
import numeral from "numeral"
import { HStack, Icon, Stack } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Card from "../Card"
import { Body3, H5 } from "../Typography"
import TokenBalance from "../TokenBalance"

interface Props {
  icon: any
  title: string
  tokenBalance: number | string
  usdBalance: string
}

const TokenBalanceCardTemplate: FC<Props> = ({
  icon,
  title,
  tokenBalance,
  usdBalance,
}) => {
  return (
    <Card>
      <Stack>
        <HStack>
          <Icon boxSize="16px" as={icon} />
          <Body3>{title}</Body3>
        </HStack>
        <TokenBalance
          tokenAmount={tokenBalance}
          usdBalance={usdBalance}
          withUSDBalance
        />
      </Stack>
    </Card>
  )
}

export default TokenBalanceCardTemplate
