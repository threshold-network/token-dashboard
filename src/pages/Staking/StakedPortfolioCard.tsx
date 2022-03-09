import { FC } from "react"
import { HStack, Stack, Divider } from "@chakra-ui/react"
import Card from "../../components/Card"
import { Body1, Body2, Label3 } from "../../components/Typography"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"
import BoxLabel from "../../components/BoxLabel"
import { StakingContractLearnMore } from "../../components/ExternalLink"
import { SimpleTokenAmountForm } from "../../components/Forms"
import { ModalType, Token } from "../../enums"
import { useStakingState } from "../../hooks/useStakingState"
import { useModal } from "../../hooks/useModal"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { formatTokenAmount } from "../../utils/formatAmount"

const StakedPortfolioCard: FC = () => {
  const { openModal } = useModal()
  const tBalance = useTokenBalance(Token.T)

  const openStakingModal = async (stakeAmount: string) => {
    openModal(ModalType.StakingChecklist, { stakeAmount })
  }

  const { stakedBalance } = useStakingState()

  return (
    <Card h="fit-content">
      <Stack spacing={6}>
        <Label3 mb={6} textTransform="uppercase">
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
          <Body1>{formatTokenAmount(tBalance)} T</Body1>
        </HStack>
        <Divider />
        <SimpleTokenAmountForm
          onSubmitForm={openStakingModal}
          submitButtonText="Stake"
          maxTokenAmount={tBalance}
        />
        <StakingContractLearnMore />
      </Stack>
    </Card>
  )
}

export default StakedPortfolioCard
