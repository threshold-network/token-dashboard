import { FC, ReactElement, Fragment, useRef, useCallback } from "react"
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
import { FormikProps } from "formik"
import { BigNumber } from "@ethersproject/bignumber"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import NotificationPill from "../../../components/NotificationPill"
import TokenBalance from "../../../components/TokenBalance"
import InfoBox from "../../../components/InfoBox"
import BoxLabel from "../../../components/BoxLabel"
import { CopyAddressToClipboard } from "../../../components/CopyToClipboard"
import { TokenAmountForm, FormValues } from "../../../components/Forms"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { useModal } from "../../../hooks/useModal"
import { StakeData } from "../../../types/staking"
import {
  ExternalHref,
  ModalType,
  StakeType,
  Token,
  TopUpType,
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

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()

  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"

  const isPRESet =
    !isAddressZero(stake.preConfig.operator) &&
    stake.preConfig.isOperatorConfirmed

  const submitButtonText = !isStakeAction ? "Unstake" : "Top-up"
  const onChangeAction = useCallback(() => {
    formRef.current?.resetForm()
    setFlag.toggle()
  }, [setFlag.toggle])

  const onSubmitTopUp = (
    tokenAmount: string | number,
    topUpType: TopUpType
  ) => {
    openModal(ModalType.TopupT, { stake, amountTopUp: tokenAmount, topUpType })
  }

  const onSubmitUnstakeOrTopupBtn = () => {
    if (isStakeAction) {
      openModal(ModalType.TopupLegacyStake, { stake })
    } else {
      openModal(ModalType.UnstakeT, { stake })
    }
  }

  const onSubmitForm = (tokenAmount: string | number) => {
    if (isStakeAction) {
      onSubmitTopUp(tokenAmount, TopUpType.NATIVE)
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
  const canTopUpKepp = BigNumber.from(stake.possibleKeepTopUpInT).gt(0)
  const canTopUpNu = BigNumber.from(stake.possibleNuTopUpInT).gt(0)

  return (
    <Card borderColor={isInActiveStake || !isPRESet ? "red.200" : undefined}>
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
        <Switcher onClick={onChangeAction} isActive={isStakeAction} />
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
      {isStakeAction && !hasLegacyStakes && !canTopUpKepp && !canTopUpNu ? (
        <TokenAmountForm
          innerRef={formRef}
          onSubmitForm={onSubmitForm}
          label={`${isStakeAction ? "Stake" : "Unstake"} Amount`}
          submitButtonText={submitButtonText}
          maxTokenAmount={isStakeAction ? tBalance : stake.tStake}
          shouldDisplayMaxAmountInLabel
        />
      ) : canTopUpNu || canTopUpKepp ? (
        <Button
          onClick={() =>
            onSubmitTopUp(
              canTopUpNu
                ? stake.possibleNuTopUpInT
                : stake.possibleKeepTopUpInT,
              canTopUpNu ? TopUpType.LEGACY_NU : TopUpType.LEGACY_KEEP
            )
          }
          isFullWidth
        >
          Confirm Legacy Top-up
        </Button>
      ) : (
        <Button onClick={onSubmitUnstakeOrTopupBtn} isFullWidth>
          {submitButtonText}
        </Button>
      )}
      {!isPRESet && (
        <Button as="a" mt="4" href={ExternalHref.preNodeSetup} isFullWidth>
          Set PRE
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
