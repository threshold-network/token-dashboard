import { FC, useContext } from "react"
import { BodyMd } from "@threshold-network/components"
import InfoBox from "../../../../components/InfoBox"
import TokenBalance from "../../../../components/TokenBalance"
import LegacyStakeBalances from "./LegacyStakeBalances"
import { useStakeCardContext } from "../../../../hooks/useStakeCardContext"

const StakeBalance: FC<{
  nuInTStake: string
  keepInTStake: string
  tStake: string
  totalInTStake: string
}> = ({ nuInTStake, keepInTStake, tStake, totalInTStake }) => {
  const { hasLegacyStakes } = useStakeCardContext()

  return hasLegacyStakes ? (
    <LegacyStakeBalances
      nuInTStake={nuInTStake}
      keepInTStake={keepInTStake}
      tStake={tStake}
      totalInTStake={totalInTStake}
    />
  ) : (
    <>
      <BodyMd mt="6" mb="3">
        Total Staked Balance
      </BodyMd>
      <InfoBox m="0">
        <TokenBalance tokenAmount={totalInTStake} withSymbol tokenSymbol="T" />
      </InfoBox>
    </>
  )
}

export default StakeBalance
