import { ComponentProps, FC } from "react"
import { HStack, Stack, Divider } from "@chakra-ui/react"
import {
  BodyLg,
  BodyMd,
  LabelSm,
  Card,
  BoxLabel,
} from "@threshold-network/components"
import InfoBox from "../../components/InfoBox"
import TokenBalance from "../../components/TokenBalance"
import { StakingContractLearnMore } from "../../components/ExternalLink"
import { TokenAmountForm } from "../../components/Forms"
import { useStakingState } from "../../hooks/useStakingState"
import { useModal } from "../../hooks/useModal"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { ModalType, Token } from "../../enums"
import { formatTokenAmount } from "../../utils/formatAmount"
import { useMinStakeAmount } from "../../hooks/useMinStakeAmount"

const StakedPortfolioCard: FC<ComponentProps<typeof Card>> = (props) => {
  const { openModal } = useModal()
  const tBalance = useTokenBalance(Token.T)
  const minStakeAmount = useMinStakeAmount()

  const openStakingModal = async (stakeAmount: string) => {
    openModal(ModalType.StakingChecklist, { stakeAmount })
  }

  const { stakedBalance } = useStakingState()

  return (
    <Card h="fit-content" {...props}>
      <LabelSm mb={6} textTransform="uppercase">
        Staked Portfolio
      </LabelSm>
      <BodyMd mb={2}>Staked Balance</BodyMd>
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
        <BodyLg>{formatTokenAmount(tBalance)} T</BodyLg>
      </HStack>
      <Divider my="6" />
      <TokenAmountForm
        onSubmitForm={openStakingModal}
        label="Stake Amount"
        submitButtonText="Stake"
        maxTokenAmount={tBalance}
        placeholder={`Minimum stake ${
          minStakeAmount === "0"
            ? "loading..."
            : `${formatTokenAmount(minStakeAmount)} T`
        }`}
        minTokenAmount={minStakeAmount}
      />
      <StakingContractLearnMore mt="3" />
    </Card>
  )
}

export default StakedPortfolioCard
