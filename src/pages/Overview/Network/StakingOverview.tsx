import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { Body2 } from "../../../components/Typography"
import { useTokenState } from "../../../hooks/useTokenState"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import { StakingContractLearnMore } from "../../../components/ExternalLink"
import { useStakingState } from "../../../hooks/useStakingState"

const StakingOverview: FC = () => {
  const { t } = useTokenState()
  const { stakedBalance } = useStakingState()

  return (
    <CardTemplate title="STAKING" height="fit-content">
      <Body2 mb={2}>Staked Balance</Body2>
      <InfoBox mt={4}>
        <TokenBalance
          icon={t.icon}
          tokenAmount={stakedBalance.toString()}
          isLarge
        />
      </InfoBox>
      <Button size="lg" isFullWidth mt={4} as={RouterLink} to="/staking">
        Go to Staking
      </Button>
      <StakingContractLearnMore />
    </CardTemplate>
  )
}

export default StakingOverview
