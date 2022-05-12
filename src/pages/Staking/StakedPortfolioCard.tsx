import { ComponentProps, FC } from "react"
import { HStack, Stack, Divider } from "@chakra-ui/react"
import Card from "../../components/Card"
import { Body1, Body2, Label3 } from "../../components/Typography"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"
import BoxLabel from "../../components/BoxLabel"
import { StakingContractLearnMore } from "../../components/ExternalLink"
import { TokenAmountForm } from "../../components/Forms"
import { useStakingState } from "../../hooks/useStakingState"
import { useModal } from "../../hooks/useModal"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { ModalType, Token } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"

const StakedPortfolioCard: FC<ComponentProps<typeof Card>> = (props) => {
  const { openModal } = useModal()
  const tBalance = useTokenBalance(Token.T)

  const openStakingModal = async (stakeAmount: string) => {
    openModal(ModalType.StakingChecklist, { stakeAmount })
  }

  const { stakedBalance } = useStakingState()

  return (
    <Card h="fit-content" {...props}>
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
      <HStack mt="8" justify="space-between" w="100%">
        <BoxLabel>Wallet</BoxLabel>
        <Body1>{formatTokenAmount(tBalance)} T</Body1>
      </HStack>
      <Divider my="6" />
      <TokenAmountForm
        onSubmitForm={openStakingModal}
        label="Stake Amount"
        submitButtonText="Stake"
        maxTokenAmount={tBalance}
      />
      <StakingContractLearnMore mt="3" />
    </Card>
  )
}

export default StakedPortfolioCard
