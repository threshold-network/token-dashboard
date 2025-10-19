import { Stack, Box } from "@chakra-ui/react"
import BridgePanel from "./components/BridgePanel"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { BridgeActivityCard } from "./components/BridgeActivityCard"
import { ClaimableWithdrawalsCard } from "./components/ClaimableWithdrawalsCard"
import { Token } from "../../../enums"
import { PageComponent } from "../../../types"
import { useBridgeActivity } from "../../../hooks/tbtc/useBridgeActivity"

const TBTCBridge: PageComponent = () => {
  const { data, isFetching, refetch } = useBridgeActivity()

  return (
    <Stack
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Stack
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <BridgePanel onBridgeSuccess={refetch} />
        <Stack
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            width: "50%",
          }}
        >
          <TokenBalanceCard token={Token.TBTCV2} />
          <BridgeActivityCard data={data} isFetching={isFetching} />
        </Stack>
      </Stack>
      <Box style={{ marginTop: "16px" }}>
        <ClaimableWithdrawalsCard onClaim={refetch} />
      </Box>
    </Stack>
  )
}

TBTCBridge.route = {
  path: "bob-bridge",
  title: "Bob Bridge",
  index: true,
  isPageEnabled: true,
}

export default TBTCBridge
