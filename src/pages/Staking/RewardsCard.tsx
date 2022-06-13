import { FC } from "react"
import { Badge, Box, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "../../components/Card"
import { Body1, Body2, Body3, Label3 } from "../../components/Typography"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()

  return (
    <Card>
      <Label3 textTransform="uppercase">Rewards</Label3>
      <Body2 mt="6">Total Staking Bonus</Body2>
      <InfoBox mt="2" bg={active ? "brand.50" : undefined}>
        {active ? (
          <TokenBalance
            tokenAmount={totalBonusBalance}
            withSymbol
            tokenSymbol="T"
            isLarge
          />
        ) : (
          <Body2>
            Rewards are released at the end of each month and can be claimed
            retroactively for March and April.
          </Body2>
        )}
      </InfoBox>

      <Button mt="4" colorScheme="gray" disabled={true} isFullWidth>
        See All Rewards
      </Button>
      <Body3
        mt="2"
        textAlign="center"
        color={useColorModeValue("gray.500", "gray.300")}
      >
        Rewards are released at the end of each month
      </Body3>
    </Card>
  )
}

export default RewardsCard
