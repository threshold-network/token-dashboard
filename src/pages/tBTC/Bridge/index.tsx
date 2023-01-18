import { useEffect } from "react"
import { Grid, Box, Skeleton, Stack } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { MintingCard } from "./MintingCard"
import { UnmintingCard } from "./UnmintingCard"
import {
  TransactionHistoryCard,
  TransactionHistoryTable,
} from "./TransactionHistory"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintingType } from "../../../types/tbtc"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { useTBTCTerms } from "../../../hooks/useTBTCTerms"
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeTransacionHistory, tbtcSlice } from "../../../store/tbtc"
import { useWeb3React } from "@web3-react/core"

const gridTemplateAreas = {
  base: `
    "main"
    "aside"
    `,
  xl: `"aside main"`,
}

const TBTCBridge: PageComponent = (props) => {
  const { mintingType } = useTbtcState()
  const { openModal } = useModal()
  const { hasUserResponded } = useTBTCTerms()
  const dispatch = useAppDispatch()
  const bridgeTransactionHistory = useAppSelector(selectBridgeTransacionHistory)
  const isBridgeTxHistoryFetching = useAppSelector(
    (state) => state.tbtc.transactionsHistory.isFetching
  )
  const { account } = useWeb3React()

  useEffect(() => {
    if (!hasUserResponded) openModal(ModalType.NewTBTCApp)
  }, [hasUserResponded])

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeTransactionHistory({
        depositor: account,
      })
    )
  }, [dispatch, account])

  return (
    <Grid
      gridTemplateAreas={gridTemplateAreas}
      gridTemplateColumns={{ base: "1fr", xl: "25% 1fr" }}
      gap="5"
    >
      <Box gridArea="main" minW="0">
        <MintUnmintNav w="100%" gridArea="nav" mb="5" />
        {mintingType === TbtcMintingType.mint && (
          <MintingCard gridArea="main-card" p={35} />
        )}
        {mintingType === TbtcMintingType.unmint && (
          <UnmintingCard gridArea="main-card" p={35} />
        )}
      </Box>
      <Box gridArea="aside">
        <TbtcBalanceCard gridArea="balance-card" mb="5" />
        <TransactionHistoryCard>
          {isBridgeTxHistoryFetching ? (
            <Stack>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            <TransactionHistoryTable data={bridgeTransactionHistory} />
          )}
        </TransactionHistoryCard>
      </Box>
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
