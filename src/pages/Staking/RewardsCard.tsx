import { FC } from "react"
import Card from "../../components/Card"
import { Body2, Body3, Label3 } from "../../components/Typography"
import { Box, Stack } from "@chakra-ui/react"
import { formatNumeral } from "../../utils/formatAmount"
import InfoBox from "../../components/InfoBox"

const RewardsCard: FC = () => {
  return (
    <Card>
      <Stack spacing={4}>
        <Box>
          <Label3 textDecoration="uppercase">Rewards</Label3>
          <Body2 mb={2}>Total Rewards</Body2>
          <InfoBox text={`${formatNumeral(0)} T`} />
          <Body3 color="gray.500">
            Rewards are released at the end of each month
          </Body3>
        </Box>
      </Stack>
    </Card>
  )
}

export default RewardsCard
