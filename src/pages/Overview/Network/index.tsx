import { useEffect } from "react"
import {
  Box,
  Card,
  HStack,
  SimpleGrid,
  Image,
  H5,
  BodyMd,
  VStack,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import TotalValueLocked from "./TotalValueLocked"
import StakingOverview from "./StakingOverview"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { PageComponent } from "../../../types"
import { TBTCBridgeStats } from "./tBTCBridgeStats"
import { useFetchRecentDeposits } from "../../../hooks/tbtc"
import { TBTCUserStats } from "./tBTCUserStats"
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeActivity, tbtcSlice } from "../../../store/tbtc"
import ButtonLink from "../../../components/ButtonLink"
import upgradeToTIcon from "../../../static/images/upgrade-to-t.svg"
import { CoveragePoolsTVLCard } from "../../tBTC/CoveragePools"

const Network: PageComponent = () => {
  const [tvlInUSD, fetchtTvlData, tvlInTokenUnits] = useFetchTvl()
  const [deposits, isFetching, error] = useFetchRecentDeposits()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const bridgeActivity = useAppSelector(selectBridgeActivity)
  const isBridgeActivityFetching = useAppSelector(
    (state) => state.tbtc.bridgeActivity.isFetching
  )

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeActivity({
        depositor: account,
      })
    )
  }, [dispatch, account])

  useEffect(() => {
    fetchtTvlData()
  }, [fetchtTvlData])

  return (
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
      <TBTCBridgeStats
        tvl={tvlInTokenUnits.tBTC}
        tvlInUSD={tvlInUSD.tBTC}
        deposits={deposits}
      />
      <TBTCUserStats
        bridgeActivity={bridgeActivity}
        isBridgeActivityFetching={isBridgeActivityFetching}
      />
      <VStack spacing="4">
        <CoveragePoolsTVLCard tvl={tvlInUSD.coveragePool} />
        <TotalValueLocked totalValueLocked={tvlInUSD.total} />
        <Card>
          <HStack spacing="6">
            <Image src={upgradeToTIcon} />
            <Box>
              <H5>Do you own KEEP or NU tokens?</H5>
              <BodyMd>Upgrade your tokens to T.</BodyMd>
            </Box>
          </HStack>
          <ButtonLink
            to="/upgrade"
            variant="outline"
            size="lg"
            isFullWidth
            mt="9"
          >
            Upgrade
          </ButtonLink>
        </Card>
      </VStack>
      <StakingOverview />
    </SimpleGrid>
  )
}

Network.route = {
  path: "network",
  index: true,
  title: "Network",
  isPageEnabled: true,
}
export default Network
