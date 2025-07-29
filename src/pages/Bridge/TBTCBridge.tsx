import { Stack } from "@chakra-ui/react"
import BridgePanel from "./components/BridgePanel"
import TokenBalanceCard from "../../components/TokenBalanceCard"
import { Token } from "../../enums"
import { PageComponent } from "../../types"

const TBTCBridge: PageComponent = () => {
  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      spacing={4}
      w="100%"
      align="flex-start"
    >
      <BridgePanel />
      <Stack spacing={4} w={{ base: "100%", md: "50%" }}>
        <TokenBalanceCard token={Token.TBTCV2} />
      </Stack>
    </Stack>
  )
}

TBTCBridge.route = {
  path: "tbtc-bridge",
  title: "tBTC Bridge",
  index: true,
  isPageEnabled: true,
}

export default TBTCBridge
