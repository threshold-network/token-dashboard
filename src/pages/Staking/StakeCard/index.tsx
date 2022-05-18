import { FC, ReactElement, Fragment } from "react"
import {
  Flex,
  Box,
  Badge,
  ButtonGroup,
  Button,
  useColorModeValue,
  useBoolean,
  Tooltip,
  Icon,
  FlexProps,
} from "@chakra-ui/react"
import { InfoIcon } from "@chakra-ui/icons"
import { BigNumber } from "@ethersproject/bignumber"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import NotificationPill from "../../../components/NotificationPill"
import TokenBalance from "../../../components/TokenBalance"
import InfoBox from "../../../components/InfoBox"
import BoxLabel from "../../../components/BoxLabel"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"
import { TokenAmountForm } from "../../../components/Forms"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { useModal } from "../../../hooks/useModal"
import { StakeData } from "../../../types/staking"
import {
  ExternalHref,
  ModalType,
  StakeType,
  Token,
  UnstakeType,
} from "../../../enums"
import {
  Tree,
  TreeItem,
  TreeNode,
  TreeItemLineToNode,
} from "../../../components/Tree"
import { Divider } from "../../../components/Divider"
import { isAddressZero } from "../../../web3/utils"
import { pre as preConstants } from "../../../constants"
import { parseEther } from "ethers/lib/utils"

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()

  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"

  const isPRESet =
    !isAddressZero(stake.preConfig.operator) &&
    stake.preConfig.isOperatorConfirmed

  const shouldDisplayLowPREFunds =
    !isAddressZero(stake.preConfig.operator) &&
    !stake.preConfig.isOperatorConfirmed &&
    BigNumber.from(stake.preConfig.operatorEthBalance).lt(
      parseEther(preConstants.LOW_FUNDS_THRESHOLD_IN_ETH)
    )

  const submitButtonText = !isStakeAction
    ? "Unstake"
    : isPRESet
    ? "Top-up"
    : "Set PRE"

  const onSubmitTopUpForm = (tokenAmount: string | number) => {
    openModal(ModalType.TopupT, { stake, amountTopUp: tokenAmount })
  }

  const onSubmitUnstakeBtn = () => {
    openModal(ModalType.UnstakeT, { stake })
  }

  const onSubmitForm = (tokenAmount: string | number) => {
    if (isStakeAction) {
      if (isPRESet) {
        onSubmitTopUpForm(tokenAmount)
      } else {
        window.open(ExternalHref.preNodeSetup, "_blank")
      }
    } else {
      // We display the unstake form for stakes that only contains T liquid
      // stake in the `StakeCard` directly. So we can go straight to the step 2
      // of the unstaking flow and force the unstake type to `native`.
      openModal(ModalType.UnstakeTStep2, {
        stake,
        amountToUnstake: tokenAmount,
        unstakeType: UnstakeType.NATIVE,
      })
    }
  }

  const isInActiveStake = BigNumber.from(stake.totalInTStake).isZero()

  return (
    <Card
      borderColor={
        isInActiveStake || !isPRESet || shouldDisplayLowPREFunds
          ? "red.200"
          : undefined
      }
    >
      <StakeCardHeader>
        <Badge
          colorScheme={isInActiveStake ? "gray" : "green"}
          variant="subtle"
          size="small"
          mr="2"
        >
          {isInActiveStake ? "inactive" : "active"}
        </Badge>
        <StakeCardHeaderTitle stake={stake} />
        <Switcher onClick={setFlag.toggle} isActive={isStakeAction} />
      </StakeCardHeader>
      <Body2 mt="10" mb="4">
        Staking Bonus
      </Body2>
      <Flex alignItems={"end"}>
        <TokenBalance
          tokenAmount={stake.bonusEligibility.reward}
          withSymbol
          tokenSymbol="T"
          isLarge
        />
        {!isPRESet && (
          <Badge bg={"red.400"} variant="solid" size="medium" ml="3">
            missing PRE
          </Badge>
        )}
        {shouldDisplayLowPREFunds && (
          <Badge bg={"red.400"} variant="solid" size="medium" ml="3">
            low PRE funds
          </Badge>
        )}
      </Flex>
      <Divider mb="0" />
      {hasLegacyStakes ? (
        <BalanceTree stake={stake} />
      ) : (
        <>
          <Body2 mt="6" mb="3">
            Staked Balance
          </Body2>
          <InfoBox m="0">
            <TokenBalance
              tokenAmount={stake.totalInTStake}
              withSymbol
              tokenSymbol="T"
            />
          </InfoBox>
        </>
      )}

      <Flex mt="6" mb="8" alignItems="center">
        <BoxLabel bg="brand.50" color="brand.700" mr="auto">
          Provider address
        </BoxLabel>
        <CopyAddressToClipboard address={stake.stakingProvider} />
      </Flex>
      {isStakeAction || !hasLegacyStakes ? (
        <TokenAmountForm
          onSubmitForm={onSubmitForm}
          label={`${isStakeAction ? "Stake" : "Unstake"} Amount`}
          submitButtonText={submitButtonText}
          maxTokenAmount={isStakeAction ? tBalance : stake.tStake}
          shouldDisplayMaxAmountInLabel
          isDisabled={!isPRESet}
          shouldValidateForm={isPRESet}
        />
      ) : (
        <Button onClick={onSubmitUnstakeBtn} isFullWidth>
          {submitButtonText}
        </Button>
      )}
    </Card>
  )
}

export const StakeCardHeader: FC = ({ children }) => {
  return (
    <Flex as="header" alignItems="center">
      {children}
    </Flex>
  )
}

export const StakeCardHeaderTitle: FC<{ stake: StakeData | null }> = ({
  stake,
}) => {
  const stakeType = !stake
    ? ""
    : stake.stakeType === StakeType.NU || stake.stakeType === StakeType.KEEP
    ? ` - legacy ${StakeType[stake.stakeType]}`
    : " - native"
  return (
    <>
      <NotificationPill colorScheme="brand" mr="2" variant="gradient" />
      <Label3 textTransform="uppercase" mr="auto">
        stake{stakeType}
      </Label3>
    </>
  )
}

export const StakeCardProviderAddress: FC<
  {
    stakingProvider: string
  } & FlexProps
> = ({ stakingProvider, ...restProps }) => {
  const isNotAddressZero = !isAddressZero(stakingProvider)

  return (
    <Flex mt="6" mb="8" alignItems="center" {...restProps}>
      <BoxLabel bg="brand.50" color="brand.700" mr="auto">
        Provider address
      </BoxLabel>
      {isNotAddressZero ? (
        <CopyAddressToClipboard address={stakingProvider} />
      ) : (
        <Box as="span" color="brand.500">
          none set
        </Box>
      )}
    </Flex>
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

const BalanceTree: FC<{ stake: StakeData }> = ({ stake }) => {
  return (
    <Tree>
      <TreeNode isRoot>
        <BalanceTreeItem
          isRoot
          label={
            <>
              Total Staked Balance{" "}
              <Tooltip
                label="Staked Balance for Legacy Stakes are cumulated KEEP, NU and T staked tokens displayed in T."
                fontSize="md"
                bg="white"
                color="gray.700"
                textAlign="center"
                p="2"
                offset={[150, 10]}
                hasArrow
              >
                <Icon as={InfoIcon} />
              </Tooltip>
            </>
          }
          value={stake.totalInTStake}
        >
          <TreeNode>
            <BalanceTreeItem label="Native Stake" value={stake.tStake} />
            {stake.keepInTStake !== "0" && (
              <BalanceTreeItem
                label="KEEP Stake in T"
                value={stake.keepInTStake}
              />
            )}
            {stake.nuInTStake !== "0" && (
              <BalanceTreeItem label="NU Stake in T" value={stake.nuInTStake} />
            )}
          </TreeNode>
        </BalanceTreeItem>
      </TreeNode>
    </Tree>
  )
}

const BalanceTreeItem: FC<{
  label: string | ReactElement
  value: string
  isRoot?: boolean
}> = ({ label, value, children, isRoot = false }) => {
  const LineComponent = isRoot ? Fragment : TreeItemLineToNode
  return (
    <TreeItem>
      <Body2 fontWeight="400" pt="6" pb="3">
        {label}
      </Body2>
      <LineComponent>
        <InfoBox m="0">
          <TokenBalance tokenAmount={value} withSymbol tokenSymbol="T" />
        </InfoBox>
      </LineComponent>
      {children}
    </TreeItem>
  )
}

export default StakeCard
