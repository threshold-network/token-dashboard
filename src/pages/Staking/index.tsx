import { FC, useEffect } from "react"
import { Box, HStack, Stack } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import StakingChecklistCard from "./StakingChecklistCard"
import StakedPortfolioCard from "./StakedPortfolioCard"
import RewardsCard from "./RewardsCard"
import { useFetchOwnerStakes } from "../../hooks/useFetchOwnerStakes"
import { Body1, H1 } from "../../components/Typography"
import { setStakes } from "../../store/staking"
import { useStakingState } from "../../hooks/useStakingState"

const StakingPage: FC = () => {
  const fetchOwnerStakes = useFetchOwnerStakes()
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const { stakes } = useStakingState()

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
    <Box>
      <Stack direction={{ base: "column", lg: "row" }} w="100%">
        <StakedPortfolioCard />
        <Stack direction="column" w="100%">
          <RewardsCard />
          <StakingChecklistCard />
        </Stack>
      </Stack>
      <Stack direction="column" w="100%">
        {/* Render test- replace it with the correct UI*/}
        <H1>Your stakes</H1>
        {stakes.map((stake) => {
          return (
            <HStack key={stake.operator}>
              <Body1>{stake.operator}</Body1>
              <Body1>{stake.tStake.toString()}</Body1>
              <Body1>{stake.stakeType}</Body1>
            </HStack>
          )
        })}
      </Stack>
    </Box>
  )
}

export default StakingPage
