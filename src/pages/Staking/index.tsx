import { Box, Stack } from "@chakra-ui/react"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import { useStakingState } from "../../hooks/useStakingState"
import StakesTable from "./StakesTable"
import { PageComponent } from "../../types"
import PageLayout from "../PageLayout"

const StakingPage: PageComponent = (props) => {
  const { stakes } = useStakingState()

  return (
    <PageLayout {...props}>
      <Stack direction={{ base: "column", lg: "row" }} w="100%">
        <StakedPortfolioCard />
        <StakingChecklistCard />
      </Stack>
      {stakes.length > 0 && (
        <Box mt={4} w="100%">
          <StakesTable stakes={stakes} />
        </Box>
      )}
    </PageLayout>
  )
}

StakingPage.route = {
  path: "staking",
  index: false,
  title: "Staking",
}

export default StakingPage
