import { FC, useEffect } from "react"
import { Box, Container, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import RewardsCard from "./RewardsCard"
import { useFetchOwnerStakes } from "../../hooks/useFetchOwnerStakes"
import { setStakes } from "../../store/staking"
import { useStakingState } from "../../hooks/useStakingState"
import StakesTable from "./StakesTable"

const StakingPage: FC = () => {
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
    <Container maxW={{ base: "2xl", xl: "6xl" }} my={16}>
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
    </Container>
  )
}

export default StakingPage
