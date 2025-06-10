import { useEffect } from "react"
import { Grid, Box } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { BridgeActivityCard } from "./BridgeActivityCard"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeActivity, tbtcSlice } from "../../../store/tbtc"
import { Outlet } from "react-router"
import { MintPage } from "./Mint"
import { UnmintPage } from "./Unmint"
import { useIsActive } from "../../../hooks/useIsActive"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useNonEVMConnection } from "../../../hooks/useNonEVMConnection"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"

const gridTemplateAreas = {
  base: `
    "main"
    "aside"
    `,
  xl: `"aside main"`,
}

const TBTCBridge: PageComponent = (props) => {
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const bridgeActivity = useAppSelector(selectBridgeActivity)
  const isBridgeActivityFetching = useAppSelector(
    (state) => state.tbtc.bridgeActivity.isFetching
  )
  const mintingStep = useAppSelector((state) => state.tbtc.mintingStep)
  const { account } = useIsActive()
  const { isNonEVMActive, nonEVMPublicKey, nonEVMChainName } =
    useNonEVMConnection()
  const threshold = useThreshold()
  const { depositor } = useTbtcState()
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()

  // For StarkNet connections, use the Ethereum depositor address from the deposit
  // For regular EVM connections, use the account address
  let effectiveAccount = account

  if (isNonEVMActive && nonEVMChainName === "Starknet") {
    // For StarkNet, check if we have a depositor from current state
    if (depositor) {
      effectiveAccount = depositor
    } else if (nonEVMPublicKey && tBTCDepositData[nonEVMPublicKey]) {
      // Otherwise check localStorage for saved deposit data
      effectiveAccount =
        tBTCDepositData[nonEVMPublicKey].depositor?.identifierHex
    }
  }

  useEffect(() => {
    if (!hasUserResponded) openModal(ModalType.NewTBTCApp)
  }, [hasUserResponded])

  useEffect(() => {
    if (!effectiveAccount) return
    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: effectiveAccount,
      })
    )
  }, [
    dispatch,
    effectiveAccount,
    mintingStep,
    threshold.tbtc.ethereumChainId,
    depositor,
  ])

  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateColumns={{ base: "1fr", xl: "25% 1fr" }}
      gap="5"
    >
      <Box gridArea="main" minW="0" position="relative">
        <MintUnmintNav w="100%" gridArea="nav" mb="5" pages={props.pages!} />
        <Outlet />
      </Box>
      <Box gridArea="aside">
        <TbtcBalanceCard gridArea="balance-card" mb="5" />
        <BridgeActivityCard
          data={bridgeActivity}
          isFetching={isBridgeActivityFetching}
        />
      </Box>
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  pathOverride: "*",
  pages: [MintPage, UnmintPage],
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
