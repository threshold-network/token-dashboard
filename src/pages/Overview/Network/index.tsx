import { FC } from "react"
import { Box, Stack, VStack } from "@chakra-ui/react"
import TotalValueLocked from "./TotalValueLocked"
import Interest from "./Interest"
import Governance from "./Governance"
import UpgradeBanner from "./UpgradeBanner"
import WalletBalances from "./WalletBalances"
import Nodes from "./Nodes"

const Network: FC<{ totalValueLocked: string }> = ({ totalValueLocked }) => {
  return (
    <VStack spacing={4} mt={4}>
      <UpgradeBanner />
      <Stack direction={{ base: "column", xl: "row" }} w="100%">
        <Box w={{ base: "100%", xl: "50%" }}>
          <WalletBalances />
        </Box>
        <Stack w={{ base: "100%", xl: "50%" }}>
          <TotalValueLocked totalValueLocked={totalValueLocked} />
          <Nodes />
        </Stack>
      </Stack>
      <Governance />
      <Interest />
    </VStack>
  )
}
export default Network
