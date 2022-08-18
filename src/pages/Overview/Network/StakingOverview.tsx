import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { BodyMd } from "@threshold-network/components"
import { useTokenState } from "../../../hooks/useTokenState"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import { StakingContractLearnMore } from "../../../components/ExternalLink"
import { useStakingState } from "../../../hooks/useStakingState"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"

const StakingOverview: FC = () => {
  const { t } = useTokenState()
  const { stakedBalance } = useStakingState()

  const { openModal } = useModal()

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
      <Button size="lg" isFullWidth mt={4} as={RouterLink} to="/staking">
        Go to Staking
      </Button>
      <Button onClick={() => openModal(ModalType.NewAppsToAuthorize)}>
        modal
      </Button>
      <StakingContractLearnMore mt="4" />
    </CardTemplate>
  )
}

export default StakingOverview
