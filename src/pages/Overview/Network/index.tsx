import { useEffect } from "react"
import { SimpleGrid, Stack } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import TotalValueLocked from "./TotalValueLocked"
import StakingOverview from "./StakingOverview"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { PageComponent } from "../../../types"
import { TBTCBrdigeStats } from "./tBTCBridgeStats"
import { useFetchRecentDeposits } from "../../../hooks/tbtc"
import { TBTCUserStats } from "./tBTCUserStats"
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeActivity, tbtcSlice } from "../../../store/tbtc"

const Network: PageComponent = () => {
  const [tvlInUSD, fetchtTvlData, tvlInTokenUnits] = useFetchTvl()
  const [deposits, isFetching, error] = useFetchRecentDeposits()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const bridgeActivity = useAppSelector(selectBridgeActivity)
  const isBridgeActivityFetching = useAppSelector(
    (state) => state.tbtc.bridgeActivity.isFetching
  )

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: account,
      })
    )
  }, [dispatch, account])

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
      <TBTCBrdigeStats
        tvl={tvlInTokenUnits.tBTC}
        tvlInUSD={tvlInUSD.tBTC}
        deposits={deposits}
      />
      <Stack spacing={4}>
        <TBTCUserStats
          bridgeActivity={bridgeActivity}
          isBridgeActivityFetching={isBridgeActivityFetching}
        />
        <StakingOverview />
        <TotalValueLocked totalValueLocked={tvlInUSD.total} />
      </Stack>
    </SimpleGrid>
  )
}

Network.route = {
  path: "network",
  index: true,
  title: "Network",
  isPageEnabled: true,
}
export default Network
