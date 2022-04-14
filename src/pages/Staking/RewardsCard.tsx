import { FC } from "react"
import { Body2, Body3, Label3, Card } from "@threshold-network/components"
import { Box, Stack, useColorModeValue } from "@chakra-ui/react"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"

const RewardsCard: FC = () => {
  return (
    <Card>
      <Stack spacing={4}>
        <Box>
          <Label3 textDecoration="uppercase">Rewards</Label3>
          <Body2 mb={2}>Total Rewards</Body2>
          <InfoBox>
            <TokenBalance tokenAmount={0} withSymbol tokenSymbol="T" isLarge />
          </InfoBox>
          <Body3 color={useColorModeValue("gray.500", "gray.300")}>
            Rewards are released at the end of each month
          </Body3>
        </Box>
      </Stack>
    </Card>
  )
}

export default RewardsCard
