import { FC } from "react"
import { Button, useColorModeValue } from "@chakra-ui/react"
import Card from "../../components/Card"
import { Body2, Body3, Label3 } from "../../components/Typography"
import InfoBox from "../../components/InfoBox"

const RewardsCard: FC = () => {
  return (
    <Card>
      <Label3 textTransform="uppercase">Rewards</Label3>
      <Body2 mt="6">Total Rewards</Body2>
      <InfoBox mt="2">
        <Body2>
          Rewards are released at the end of each month and can be claimed
          retroactively for March and April.
        </Body2>
      </InfoBox>
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
