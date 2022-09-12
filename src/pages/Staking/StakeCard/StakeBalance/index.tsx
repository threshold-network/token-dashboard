import { FC } from "react"
import { BodyMd } from "@threshold-network/components"
import InfoBox from "../../../../components/InfoBox"
import TokenBalance from "../../../../components/TokenBalance"
import { StakeData } from "../../../../types"
import LegacyStakeBalances from "./LegacyStakeBalances"

const StakeBalance: FC<{ stake: StakeData }> = ({ stake }) => {
  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"

  return hasLegacyStakes ? (
    <LegacyStakeBalances stake={stake} />
  ) : (
    <>
      <BodyMd mt="6" mb="3">
        Total Staked Balance
      </BodyMd>
      <InfoBox m="0">
        <TokenBalance
          tokenAmount={stake.totalInTStake}
          withSymbol
          tokenSymbol="T"
        />
      </InfoBox>
    </>
  )
}

export default StakeBalance
