import { FC } from "react"
import { Box, HStack, Stack } from "@chakra-ui/react"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import RewardsCard from "./RewardsCard"

const StakingPage: FC = () => {
  return (
    <Box>
      <Stack direction={{ base: "column", lg: "row" }} w="100%">
        <StakedPortfolioCard />
        <Stack direction="column" w="100%">
          <RewardsCard />
          <StakingChecklistCard />
        </Stack>
      </Stack>
    </Box>
  )
}

export default StakingPage
