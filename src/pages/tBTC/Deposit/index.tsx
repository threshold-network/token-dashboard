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
import { getEthereumDefaultProviderChainId } from "../../../utils/getEnvVariable"

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
  const { account, chainId } = useIsActive()
  const { nonEVMPublicKey } = useNonEVMConnection()
  const threshold = useThreshold()
  const defaultChainId = getEthereumDefaultProviderChainId()

  useEffect(() => {
    if (!hasUserResponded) openModal(ModalType.NewTBTCApp)
  }, [hasUserResponded])

  useEffect(() => {
    if (!!account && !!nonEVMPublicKey) return

    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: account ?? (nonEVMPublicKey as string),
        chainId: chainId ?? defaultChainId,
      })
    )
  }, [dispatch, account, nonEVMPublicKey, mintingStep])

  // Watch for cross-chain config changes
  useEffect(() => {
    const depositor = account ?? (nonEVMPublicKey as string)
    if (!depositor) return

    // Check if SDK is ready and cross-chain is enabled
    if (
      threshold.tbtc.isTbtcReady &&
      threshold.config.crossChain.isCrossChain
    ) {
      dispatch(
        tbtcSlice.actions.crossChainConfigChanged({
          isCrossChain: true,
          depositor,
          chainId: chainId ?? defaultChainId,
        })
      )
    }
  }, [
    threshold.tbtc.isTbtcReady,
    threshold.config.crossChain.isCrossChain,
    account,
    nonEVMPublicKey,
    dispatch,
  ])

  // Watch for ethereum chain ID changes
  useEffect(() => {
    const depositor = account ?? (nonEVMPublicKey as string)
    if (!depositor) return

    // Check if SDK is ready and we have a chainId
    if (threshold.tbtc.isTbtcReady && threshold.config.ethereum.chainId) {
      dispatch(
        tbtcSlice.actions.ethereumChainIdChanged({
          chainId: Number(threshold.config.ethereum.chainId),
          depositor,
        })
      )
    }
  }, [
    threshold.tbtc.isTbtcReady,
    threshold.config.ethereum.chainId,
    account,
    nonEVMPublicKey,
    dispatch,
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
  path: "deposit",
  index: true,
  pages: [MintPage, UnmintPage],
  title: "Deposit",
  isPageEnabled: true,
}

export default TBTCBridge
