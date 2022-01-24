import { useEffect } from "react"
import { Box, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import RewardsCard from "./RewardsCard"
import { useFetchOwnerStakes } from "../../hooks/useFetchOwnerStakes"
import { setStakes } from "../../store/staking"
import { useStakingState } from "../../hooks/useStakingState"
import StakesTable from "./StakesTable"
import { PageComponent } from "../../types"
import PageLayout from "../PageLayout"

const StakingPage: PageComponent = (props) => {
  const fetchOwnerStakes = useFetchOwnerStakes()
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { stakes, stakedBalance } = useStakingState()

  useEffect(() => {
    const fn = async () => {
      if (account) {
        const result = await fetchOwnerStakes(account)
        dispatch(setStakes(result))
      }
    }
    fn()
  }, [fetchOwnerStakes, account, dispatch])

  return (
    <PageLayout {...props}>
      <Stack direction={{ base: "column", lg: "row" }} w="100%">
        <StakedPortfolioCard />
        <Stack direction="column" w="100%">
          <RewardsCard />
          <StakingChecklistCard />
        </Stack>
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
