import { FC } from "react"
import Card from "../../components/Card"
import { Body1, Body2, Body3, Label3 } from "../../components/Typography"
import { useModal } from "../../hooks/useModal"
import { ModalType } from "../../enums"
import SubmitTxButton from "../../components/SubmitTxButton"
import InfoBox from "../../components/InfoBox"
import { useStakingState } from "../../hooks/useStakingState"
import { formatTokenAmount } from "../../utils/formatAmount"
import { HStack, Link, Stack, useColorModeValue } from "@chakra-ui/react"
import { useTokenState } from "../../hooks/useTokenState"
import { Divider } from "../../components/Divider"

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
        <InfoBox text={`${formatTokenAmount(stakedBalance.toString())} T`} />
        <HStack justify="space-between" w="100%">
          <Body1
            borderRadius="md"
            px={2}
            py={1}
            bg={useColorModeValue("gray.50", "gray.700")}
          >
            Wallet
          </Body1>
          <Body1>{formatTokenAmount(t.balance)} T</Body1>
        </HStack>
        <Divider />
        <SubmitTxButton onSubmit={openStakingModal} submitText="STAKE" />
        <HStack justify="center" mt={4}>
          <Link
            color={useColorModeValue("brand.500", "white")}
            textDecoration="underline"
          >
            Read More
          </Link>{" "}
          <Body3 color="gray.500">about Staking Contract</Body3>
        </HStack>
      </Stack>
    </Card>
  )
}

export default StakedPortfolioCard
