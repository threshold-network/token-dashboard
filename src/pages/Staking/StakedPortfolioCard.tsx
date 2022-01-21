import { FC } from "react"
import Card from "../../components/Card"
import { Body1, Body2, Body3, Label3 } from "../../components/Typography"
import { useModal } from "../../hooks/useModal"
import { ExternalHref, ModalType } from "../../enums"
import SubmitTxButton from "../../components/SubmitTxButton"
import InfoBox from "../../components/InfoBox"
import { useStakingState } from "../../hooks/useStakingState"
import { formatTokenAmount } from "../../utils/formatAmount"
import { HStack, Stack, useColorModeValue } from "@chakra-ui/react"
import { useTokenState } from "../../hooks/useTokenState"
import TokenBalance from "../../components/TokenBalance"
import BoxLabel from "../../components/BoxLabel"
import ExternalLink from "../../components/ExternalLink"

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
        <HStack justify="center" mt={4}>
          <ExternalLink
            href={ExternalHref.stakingContractLeanMore}
            text="Read More"
          />
          <Body3 color={useColorModeValue("gray.500", "gray.300")}>
            about Staking Contract
          </Body3>
        </HStack>
      </Stack>
    </Card>
  )
}

export default StakedPortfolioCard
