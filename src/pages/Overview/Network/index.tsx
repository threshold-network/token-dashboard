import { useEffect } from "react"
import { SimpleGrid, Stack } from "@threshold-network/components"
import TotalValueLocked from "./TotalValueLocked"
import StakingOverview from "./StakingOverview"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { PageComponent } from "../../../types"
import { TBTCBrdigeStats } from "./tBTCBridgeStats"
import { useFetchRecentDeposits } from "../../../hooks/tbtc"

const Network: PageComponent = () => {
  const [tvlInUSD, fetchtTvlData, tvlInTokenUnits] = useFetchTvl()
  const [deposits, isFetching, error] = useFetchRecentDeposits()

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
