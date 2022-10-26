import { useEffect } from "react"
import { SimpleGrid, Stack } from "@threshold-network/components"
import TotalValueLocked from "./TotalValueLocked"
import WalletBalances from "./WalletBalances"
import StakingOverview from "./StakingOverview"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { PageComponent } from "../../../types"

const Network: PageComponent = () => {
  const [data, fetchtTvlData] = useFetchTvl()

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
      <WalletBalances />
      <Stack spacing={4}>
        <StakingOverview />
        <TotalValueLocked totalValueLocked={data.total} />
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
