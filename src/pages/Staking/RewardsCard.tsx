import { FC } from "react"
import { Badge, Box, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { BodyMd, BodySm, LabelSm, Card } from "../../components/Typography"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"

const RewardsCard: FC<{
  totalRewardsBalance: string
  totalBonusBalance: string
}> = ({ totalRewardsBalance, totalBonusBalance }) => {
  const { active } = useWeb3React()

  return (
    <Card>
      <LabelSm textTransform="uppercase">Rewards</LabelSm>
      <BodyMd mt="6">Total Staking Bonus</BodyMd>
      <InfoBox mt="2" bg={active ? "brand.50" : undefined}>
        {active ? (
          <TokenBalance
            tokenAmount={totalBonusBalance}
            withSymbol
            tokenSymbol="T"
            isLarge
          />
        ) : (
          <BodyMd>
            Rewards are released at the end of each month and can be claimed
            retroactively for March and April.
          </BodyMd>
        )}
      </InfoBox>

      <Button mt="4" colorScheme="gray" disabled={true} isFullWidth>
        See all Rewards
      </Button>
      <BodySm
        mt="2"
        textAlign="center"
        color={useColorModeValue("gray.500", "gray.300")}
      >
        Rewards are released at the end of each month
      </BodySm>
    </Card>
  )
}

export default RewardsCard
