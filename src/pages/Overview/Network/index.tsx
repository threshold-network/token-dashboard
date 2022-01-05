import { FC } from "react"
import { Box, Stack, VStack } from "@chakra-ui/react"
import TotalValueLocked from "./TotalValueLocked"
import UpgradeBanner from "./UpgradeBanner"
import WalletBalances from "./WalletBalances"
import StakingOverview from "./StakingOverview"

const Network: FC = () => {
  const totalValueLocked = 30838938

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
          <TotalValueLocked totalValueLocked={totalValueLocked} />
        </Box>
      </Stack>
    </VStack>
  )
}
export default Network
