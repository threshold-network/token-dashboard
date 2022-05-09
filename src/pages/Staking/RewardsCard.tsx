import { FC } from "react"
import { BodyMd, BodySm, LabelSm, Card } from "@threshold-network/components"
import { Box, Stack, useColorModeValue } from "@chakra-ui/react"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"

const RewardsCard: FC = () => {
  return (
    <Card>
      <Stack spacing={4}>
        <Box>
          <LabelSm>Rewards</LabelSm>
          <BodyMd mb={2}>Total Rewards</BodyMd>
          <InfoBox>
            <TokenBalance tokenAmount={0} withSymbol tokenSymbol="T" isLarge />
          </InfoBox>
          <BodySm color={useColorModeValue("gray.500", "gray.300")}>
            Rewards are released at the end of each month
          </BodySm>
        </Box>
      </Stack>
    </Card>
  )
}

export default RewardsCard
