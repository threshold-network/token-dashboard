import { ComponentProps, FC } from "react"
import { HStack } from "@chakra-ui/react"
import {
  BodyLg,
  BodyMd,
  LabelSm,
  Card,
  BoxLabel,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"
import { useStakingState } from "../../hooks/useStakingState"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { Token } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"

const StakedPortfolioCard: FC<ComponentProps<typeof Card>> = (props) => {
  const tBalance = useTokenBalance(Token.T)

  const { stakedBalance } = useStakingState()

  return (
    <Card h="fit-content" {...props}>
      <LabelSm mb={6} textTransform="uppercase">
        Staked Portfolio
      </LabelSm>
      <BodyMd mb={2}>Staked Balance</BodyMd>
      <InfoBox>
        <TokenBalance
          tokenAmount={stakedBalance.toString()}
          withSymbol
          tokenSymbol="T"
          isLarge
        />
      </InfoBox>
      <HStack mt="8" justify="space-between" w="100%">
        <BoxLabel status="secondary">Wallet</BoxLabel>
        <BodyLg>{formatTokenAmount(tBalance)} T</BodyLg>
      </HStack>
    </Card>
  )
}

export default StakedPortfolioCard
