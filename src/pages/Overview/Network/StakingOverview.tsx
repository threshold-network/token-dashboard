import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { BodyMd } from "@threshold-network/components"
import { useTokenState } from "../../../hooks/useTokenState"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import { StakingContractLearnMore } from "../../../components/Link"
import { useStakingState } from "../../../hooks/useStakingState"
import ButtonLink from "../../../components/ButtonLink"

const StakingOverview: FC = () => {
  const { t } = useTokenState()
  const { stakedBalance } = useStakingState()

  return (
    <CardTemplate title="STAKING" height="fit-content">
      <BodyMd mb={2}>Staked Balance</BodyMd>
      <InfoBox mt={4}>
        <TokenBalance
          icon={t.icon}
          tokenAmount={stakedBalance.toString()}
          isLarge
        />
      </InfoBox>
      <ButtonLink size="lg" isFullWidth mt={4} to="/staking">
        Go to Staking
      </ButtonLink>
      <StakingContractLearnMore mt="4" />
    </CardTemplate>
  )
}

export default StakingOverview
