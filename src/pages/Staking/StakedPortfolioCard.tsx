import { FC } from "react"
import { Body1, Body2, Label3, Card } from "@threshold-network/components"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import SubmitTxButton from "../../components/SubmitTxButton"
import InfoBox from "../../components/InfoBox"
import { useStakingState } from "../../hooks/useStakingState"
import { formatTokenAmount } from "../../utils/formatAmount"
import { HStack, Stack } from "@chakra-ui/react"
import { useTokenState } from "../../hooks/useTokenState"
import TokenBalance from "../../components/TokenBalance"
import { BoxLabel } from "@threshold-network/components"
import { StakingContractLearnMore } from "../../components/ExternalLink"

const StakedPortfolioCard: FC = () => {
  const { openModal } = useModal()
  const { t } = useTokenState()

  const openStakingModal = async () => {
    openModal(ModalType.StakingChecklist)
  }

  const { stakedBalance } = useStakingState()

  return (
    <Card h="fit-content">
      <Stack spacing={6}>
        <Label3 mb={6} textDecoration="uppercase">
          Staked Portfolio
        </Label3>
        <Body2 mb={2}>Staked Balance</Body2>
        <InfoBox>
          <TokenBalance
            tokenAmount={stakedBalance.toString()}
            withSymbol
            tokenSymbol="T"
            isLarge
          />
        </InfoBox>
        <HStack justify="space-between" w="100%">
          <BoxLabel>Wallet</BoxLabel>
          <Body1>{formatTokenAmount(t.balance)} T</Body1>
        </HStack>
        <SubmitTxButton onSubmit={openStakingModal} submitText="Stake" />
        <StakingContractLearnMore />
      </Stack>
    </Card>
  )
}

export default StakedPortfolioCard
