import { ComponentProps, FC, useEffect } from "react"
import { Card } from "@threshold-network/components"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"
import { MintingFlowRouter } from "./MintingFlowRouter"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc/useTBTCDepositDataFromLocalStorage"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()
  const { btcDepositAddress, updateState } = useTbtcState()

  useEffect(() => {
    console.log("nosacz pan")
    if (
      tBTCDepositData &&
      tBTCDepositData.btcDepositAddress !== btcDepositAddress
    ) {
      console.log("if nosacza", tBTCDepositData)
      updateState("btcDepositAddress", tBTCDepositData.btcDepositAddress)

      updateState("ethAddress", tBTCDepositData.ethAddress)
      updateState("blindingFactor", tBTCDepositData.blindingFactor)
      updateState("btcRecoveryAddress", tBTCDepositData.btcRecoveryAddress)
      updateState("walletPublicKeyHash", tBTCDepositData.walletPublicKeyHash)
      updateState("refundLocktime", tBTCDepositData.refundLocktime)

      updateState("mintingStep", MintingStep.Deposit)
    }
  }, [])
  return (
    <Card {...props} minW="0">
      <Stack
        direction={{
          base: "column",
          md: "row",
          lg: "column",
          xl: "row",
        }}
        divider={<StackDivider />}
        h="100%"
        spacing={8}
      >
        <Box
          w={{
            base: "100%",
            md: "66%",
            lg: "100%",
            xl: "66%",
          }}
        >
          <MintingFlowRouter />
        </Box>
        <Box
          w={{
            base: "100%",
            md: "33%",
            lg: "100%",
            xl: "33%",
          }}
          minW={"216px"}
        >
          <MintingTimeline />
        </Box>
      </Stack>
    </Card>
  )
}
