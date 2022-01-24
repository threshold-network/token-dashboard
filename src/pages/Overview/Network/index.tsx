import { useEffect } from "react"
import { Box, Stack, VStack } from "@chakra-ui/react"
import TotalValueLocked from "./TotalValueLocked"
import UpgradeBanner from "./UpgradeBanner"
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
    <VStack spacing={4} mt={4}>
      <UpgradeBanner />
      <Stack direction={{ base: "column", xl: "row" }} w="100%">
        <Box w={{ base: "100%", xl: "50%" }}>
          <WalletBalances />
        </Box>
        <Box w={{ base: "100%", xl: "50%" }}>
          <StakingOverview />
        </Box>
      </Stack>
      <Stack direction={{ base: "column", xl: "row" }} w="100%">
        <Box w={{ base: "100%", xl: "50%" }}>
          <TotalValueLocked totalValueLocked={data.total} />
        </Box>
      </Stack>
    </VStack>
  )
}

Network.route = {
  path: "network",
  index: true,
  title: "Network",
}
export default Network
