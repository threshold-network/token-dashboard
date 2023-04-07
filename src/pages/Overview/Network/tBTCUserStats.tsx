import { FC } from "react"
import {
  BodyMd,
  Box,
  Card,
  Divider,
  LabelSm,
} from "@threshold-network/components"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import ButtonLink from "../../../components/ButtonLink"
import { useTokenState } from "../../../hooks/useTokenState"
import {
  BridgeActivity,
  BridgeActivityData,
  BridgeActivityProps,
  TBTCText,
} from "../../../components/tBTC"
import { tBTCFillBlack } from "../../../static/icons/tBTCFillBlack"
import Link from "../../../components/Link"

type TBTCUserStatsProps = {
  bridgeActivity: BridgeActivityProps["data"]
  isBridgeActivityFetching: BridgeActivityProps["isFetching"]
}

export const TBTCUserStats: FC<TBTCUserStatsProps> = ({
  bridgeActivity,
  isBridgeActivityFetching,
}) => {
  const { tbtcv2 } = useTokenState()
  const _bridgeActivity = bridgeActivity.slice(0, 2)

  return (
    <Card>
      <LabelSm>
        My <TBTCText /> Stats
      </LabelSm>
      <BodyMd mb={3} mt={4}>
        My Balance
      </BodyMd>
      <InfoBox>
        <TokenBalance
          icon={tBTCFillBlack}
          tokenAmount={tbtcv2.balance}
          withSymbol
          tokenSymbol="tBTC"
          isLarge
        />
      </InfoBox>
      <ButtonLink size="lg" isFullWidth mt={4} to="/tBTC">
        New Mint
      </ButtonLink>
      <Divider my="6" />
      <BodyMd mb="6">My Activity</BodyMd>
      <BridgeActivity
        data={_bridgeActivity}
        isFetching={isBridgeActivityFetching}
      >
        <BridgeActivityData />
      </BridgeActivity>
      <Box as="p" mt="16" textAlign="center">
        <Link mt="16" to={"/tBTC"}>
          View All
        </Link>
      </Box>
    </Card>
  )
}
