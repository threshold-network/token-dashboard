import { FC } from "react"
import numeral from "numeral"
import { HStack, Icon, Stack } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import Card from "../Card"
import { Body3, H5 } from "../Typography"

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
      <Stack spacing={4}>
        <HStack>
          <Icon boxSize="16px" as={icon} />
          <Body3>{title}</Body3>
        </HStack>
        <H5>{numeral(formatUnits(tokenBalance)).format("0,0.00")}</H5>
        <Body3 color="gray.500">{usdBalance}</Body3>
      </Stack>
    </Card>
  )
}

export default TokenBalanceCardTemplate
