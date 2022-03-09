import { FC } from "react"
import {
  Flex,
  Badge,
  ButtonGroup,
  Button,
  useColorModeValue,
  useBoolean,
} from "@chakra-ui/react"
import { StakeData } from "../../../types/staking"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import NotificationPill from "../../../components/NotificationPill"
import TokenBalance from "../../../components/TokenBalance"
import InfoBox from "../../../components/InfoBox"
import BoxLabel from "../../../components/BoxLabel"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { ModalType, StakeType, Token } from "../../../enums"
import { useModal } from "../../../hooks/useModal"
import { Divider } from "../../../components/Divider"
import { SimpleTokenAmountForm } from "../../../components/Forms"

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()

  const submitButtonText = isStakeAction ? "Top-up" : "Unstake"
  const stakeType =
    stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
      ? `legacy ${StakeType[stake.stakeType]}`
      : "native"

  const onSubmitForm = (tokenAmount: string | number) => {
    if (isStakeAction) {
      openModal(ModalType.TopupT, { stake, initialTopupAmount: tokenAmount })
    } else {
      openModal(ModalType.UnstakeT, { stake, initialTopupAmount: tokenAmount })
    }
  }

  return (
    <Card>
      <Flex as="header" alignItems="center">
        <Badge colorScheme="green" variant="subtle" size="small" mr="2">
          active
        </Badge>
        <NotificationPill colorScheme="brand" mr="2" variant="gradient" />
        <Label3 textTransform="uppercase" mr="auto">
          stake - {stakeType}
        </Label3>
        <Switcher onClick={setFlag.toggle} isActive={isStakeAction} />
      </Flex>
      <Body2 mt="12">Total Rewards</Body2>
      <Flex mt="4" alignItems="center">
        <TokenBalance
          tokenAmount="2000340000000000000000"
          tokenSymbol="T"
          withSymbol
          isLarge
        />
        <Button size="sm" ml="auto" variant="outline" w="28">
          Claim
        </Button>
      </Flex>
      <Divider />
      <Body2 mt="6">Staked Balance</Body2>
      <InfoBox mt="3">
        <TokenBalance
          tokenAmount={stake.totalInTStake}
          withSymbol
          tokenSymbol="T"
        />
      </InfoBox>
      <Flex mt="6" alignItems="center">
        <BoxLabel bg="brand.50" color="brand.700" mr="auto">
          Provider address
        </BoxLabel>
        <CopyAddressToClipboard address={stake.stakingProvider} />
      </Flex>
      <SimpleTokenAmountForm
        onSubmitForm={onSubmitForm}
        submitButtonText={submitButtonText}
        maxTokenAmount={tBalance}
      />
    </Card>
  )
}

const Switcher: FC<{ onClick: () => void; isActive: boolean }> = ({
  onClick,
  isActive,
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.700")
  const activeButtonColor = useColorModeValue("white", "gray.700")

  return (
    <ButtonGroup
      backgroundColor={bgColor}
      borderRadius="6px"
      p={1}
      spacing="3"
      size="xs"
    >
      <Button
        variant={isActive ? "outline" : "ghost"}
        bg={isActive ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Stake
      </Button>
      <Button
        variant={!isActive ? "outline" : "ghost"}
        bg={!isActive ? activeButtonColor : undefined}
        onClick={onClick}
      >
        Unstake
      </Button>
    </ButtonGroup>
  )
}

export default StakeCard
