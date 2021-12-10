import { FC } from "react"
import { Stack, VStack } from "@chakra-ui/react"
import TotalValueLocked from "./TotalValueLocked"
import Interest from "./Interest"
import Governance from "./Governance"
import UpgradeBanner from "./UpgradeBanner"
import WalletBalances from "./WalletBalances"
import Nodes from "./Nodes"
import { useReduxToken } from "../../../hooks/useReduxToken"

const Network: FC = () => {
  const totalValueLocked = 30838938

  return (
    <VStack spacing={4} mt={4}>
      <UpgradeBanner />
      <Stack direction={{ base: "column", md: "row" }} w="100%">
        <WalletBalances />
        <Stack>
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
