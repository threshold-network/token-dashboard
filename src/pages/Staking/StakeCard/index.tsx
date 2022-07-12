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
import {
  BodyMd,
  LabelSm,
  BoxLabel,
  Card,
  LineDivider,
} from "@threshold-network/components"
import NotificationPill from "../../../components/NotificationPill"
import TokenBalance from "../../../components/TokenBalance"
import InfoBox from "../../../components/InfoBox"
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
  UnstakeType,
} from "../../../enums"
import {
  Tree,
  TreeItem,
  TreeNode,
  TreeItemLineToNode,
} from "../../../components/Tree"
import { isAddressZero } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { Switcher } from "./Switcher"
import { BalanceTree } from "./BalanceTree"
import { StakeCardHeader } from "./Header"

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()

  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"

  const isPRESet =
    !isAddressZero(stake.preConfig.operator) &&
    stake.preConfig.isOperatorConfirmed

  const submitButtonText = !isStakeAction
    ? "Unstake"
    : isPRESet
    ? "Top-up"
    : "Set PRE"

  const onChangeAction = useCallback(() => {
    formRef.current?.resetForm()
    setFlag.toggle()
  }, [setFlag.toggle])

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
      <BodyMd mt="10" mb="4">
        Staking Bonus
      </BodyMd>
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
      <LineDivider mb="0" />
      {hasLegacyStakes ? (
        <BalanceTree stake={stake} />
      ) : (
        <>
          <BodyMd mt="6" mb="3">
            Staked Balance
          </BodyMd>
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
          innerRef={formRef}
          onSubmitForm={onSubmitForm}
          label={`${isStakeAction ? "Stake" : "Unstake"} Amount`}
          submitButtonText={submitButtonText}
          maxTokenAmount={isStakeAction ? tBalance : stake.tStake}
          shouldDisplayMaxAmountInLabel
          isDisabled={isStakeAction && !isPRESet}
          shouldValidateForm={!isStakeAction || isPRESet}
        />
      ) : (
        <Button onClick={onSubmitUnstakeBtn} isFullWidth>
          {submitButtonText}
        </Button>
      )}
    </Card>
  )
}

export default StakeCard
