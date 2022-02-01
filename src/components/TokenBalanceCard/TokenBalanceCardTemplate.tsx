import { FC } from "react"
import { HStack, Icon, Stack } from "@chakra-ui/react"
import Card from "../Card"
import { Body3 } from "../Typography"
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
        {/* <AddToMetamaskButton contract={contract} /> */}
      </Stack>
    </Card>
  )
}

export default TokenBalanceCardTemplate
