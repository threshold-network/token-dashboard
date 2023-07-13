import { FC, useEffect } from "react"
import { H5 } from "@threshold-network/components"
import { BridgeProcessCardTitle } from "./BridgeProcessCardTitle"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import {
  ProtocolHistoryRecentDeposits,
  ProtocolHistoryTitle,
  ProtocolHistoryViewMoreLink,
  TVL,
} from "../../../../components/tBTC"
import { useFetchRecentDeposits } from "../../../../hooks/tbtc"
import { useFetchTvl } from "../../../../hooks/useFetchTvl"

export const BridgeProcessEmptyState: FC<{ title: string }> = ({ title }) => {
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()
  const [deposits] = useFetchRecentDeposits(3)

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <>
      <BridgeProcessCardTitle />
      <H5 align={"center"}>{title}</H5>
      <SubmitTxButton mb="6" mt="4" />
      <TVL tvl={tvl.tBTC} tvlInUSD={tvlInUSD.tBTC} />
      <ProtocolHistoryTitle mt="8" />
      <ProtocolHistoryRecentDeposits
        deposits={deposits}
        _after={{
          content: `" "`,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100px",
          opacity: "0.9",
          background:
            "linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 117.78%)",
        }}
      />
      <ProtocolHistoryViewMoreLink mt="7" />
    </>
  )
}
