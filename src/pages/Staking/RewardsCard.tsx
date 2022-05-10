import { FC } from "react"
import { Badge, Box, Button, Flex, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import Card from "../../components/Card"
import { Body2, Body3, Label3 } from "../../components/Typography"
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
      {!active && (
        <>
          <Body2 mt="6">Total Rewards</Body2>

          <InfoBox mt="2">
            <Body2>
              Rewards are released at the end of each month and can be claimed
              retroactively for March and April.
            </Body2>
          </InfoBox>
        </>
      )}
      {active && (
        <Flex
          minWidth="max-content"
          gap={{ base: 0, md: 4 }}
          direction={{ base: "column", md: "row" }}
        >
          <Box mt={{ base: "0", md: "6" }} flex="1">
            <Body2>Total Rewards</Body2>
            <InfoBox mt="2" p="4" textAlign="right">
              <TokenBalance
                tokenAmount={totalRewardsBalance}
                withSymbol
                tokenSymbol="T"
              />
            </InfoBox>
          </Box>
          <Box
            mt={{ base: "0", md: "6" }}
            textAlign="right"
            width={{ base: "100%", md: "35%" }}
          >
            <Badge variant="subtle" colorScheme="brand">
              Staking Bonus
            </Badge>
            <InfoBox mt="2" p="4" display="flex" alignItems="end" bg="brand.50">
              <TokenBalance
                fontWeight="400"
                fontSize="18px"
                lineHeight="28px"
                tokenAmount={totalBonusBalance}
                withSymbol
                tokenSymbol="T"
              />
            </InfoBox>
          </Box>
        </Flex>
      )}
      <Button mt="4" colorScheme="gray" disabled={true} isFullWidth>
        See all Rewards
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
