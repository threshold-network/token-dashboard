import { FC, useRef, useCallback } from "react"
import {
  Flex,
  Button,
  useBoolean,
  Box,
  Alert,
  AlertDescription,
  AlertIcon,
  Link,
  Progress,
  ProgressLabel,
  StackProps,
} from "@chakra-ui/react"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { FormikProps } from "formik"
import { BigNumber } from "@ethersproject/bignumber"
import {
  BodyMd,
  BoxLabel,
  Card,
  LineDivider,
  HStack,
  Badge,
  BodyLg,
  BodySm,
} from "@threshold-network/components"
import { useSelector } from "react-redux"
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
  TopUpType,
  UnstakeType,
} from "../../../enums"
import { isAddressZero } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "./HeaderTitle"
import { Switcher } from "./Switcher"
import { BalanceTree } from "./BalanceTree"
import { StakeCardHeader } from "./Header"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { selectRewardsByStakingProvider } from "../../../store/rewards"
import { RootState } from "../../../store"
import { useNavigate } from "react-router-dom"

export interface AuthorizationAppDataProps extends StackProps {
  label: string
  isAuthorized: boolean
  percentage: number
  onAuthorizeClick: () => void
}

const AuthorizeApplicationRow: FC<AuthorizationAppDataProps> = ({
  label,
  isAuthorized,
  percentage,
  onAuthorizeClick,
  ...restProps
}) => {
  return (
    <HStack justify={"space-between"} {...restProps}>
      <Badge
        variant={"solid"}
        borderRadius={5}
        px={2}
        py={2}
        backgroundColor={"gray.50"}
        color={"gray.700"}
        textTransform={"none"}
      >
        <HStack>
          {isAuthorized && <CheckCircleIcon w={5} h={5} color={"green.500"} />}
          <BodySm>{label}</BodySm>
        </HStack>
      </Badge>
      {isAuthorized ? (
        <HStack width={"40%"}>
          <Progress
            value={percentage}
            size="lg"
            width="90%"
            colorScheme="brand"
            borderRadius={50}
          ></Progress>
          <BodySm>{percentage}%</BodySm>
        </HStack>
      ) : (
        <Button size="sm" variant="outline" onClick={onAuthorizeClick}>
          Authorize Application
        </Button>
      )}
    </HStack>
  )
}

const StakeCard: FC<{ stake: StakeData }> = ({ stake }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const [isStakeAction, setFlag] = useBoolean(true)
  const tBalance = useTokenBalance(Token.T)
  const { openModal } = useModal()
  const navigate = useNavigate()

  const hasLegacyStakes = stake.nuInTStake !== "0" || stake.keepInTStake !== "0"

  const isPRESet =
    !isAddressZero(stake.preConfig.operator) &&
    stake.preConfig.isOperatorConfirmed

  const submitButtonText = !isStakeAction ? "Unstake" : "Top-up"
  const onChangeAction = useCallback(() => {
    formRef.current?.resetForm()
    setFlag.toggle()
  }, [setFlag.toggle])

  const onAuthorizeClick = () => {
    navigate(`/staking/authorize/${stake.authorizer}`)
  }

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
  const areNodesMissing = true

  const appAuthData = {
    tbtc: {
      isAuthorized: true,
      percentage: 40,
    },
    randomBeacon: {
      isAuthorized: false,
      percentage: 0,
    },
  }

  const { total, bonus } = useSelector((state: RootState) =>
    selectRewardsByStakingProvider(state, stake.stakingProvider)
  )

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
      <HStack mt="10" mb="4">
        <BodyMd>Total Rewards</BodyMd>
        {bonus !== "0" && (
          <Badge variant="magic" mt="1rem !important" ml="auto !important">
            staking bonus
          </Badge>
        )}
      </HStack>
      <Flex alignItems="end" justifyContent="space-between">
        <TokenBalance tokenAmount={total} withSymbol tokenSymbol="T" isLarge />
        {!isPRESet ? (
          <Badge colorScheme="red" variant="solid" size="medium" ml="3">
            missing PRE
          </Badge>
        ) : (
          bonus !== "0" && <BodyLg>{formatTokenAmount(bonus)} T</BodyLg>
        )}
      </Flex>
      <LineDivider />
      <Box>
        <BodyMd>Applications</BodyMd>
        {areNodesMissing && (
          <Alert status="error" my={4} px={2} py={1}>
            <AlertIcon />
            <AlertDescription>
              Missing Nodes.{" "}
              <Link
                href={"/overview"}
                target="_blank"
                textDecoration={"underline"}
              >
                More info
              </Link>
            </AlertDescription>
          </Alert>
        )}
        <AuthorizeApplicationRow
          label={"tBTC App"}
          isAuthorized={appAuthData.tbtc.isAuthorized}
          percentage={appAuthData.tbtc.percentage}
          mb={"3"}
          onAuthorizeClick={onAuthorizeClick}
        />
        <AuthorizeApplicationRow
          label={"Random Beacon App"}
          isAuthorized={appAuthData.randomBeacon.isAuthorized}
          percentage={appAuthData.randomBeacon.percentage}
          onAuthorizeClick={onAuthorizeClick}
        />
        <Button mt="5" width="100%">
          Configure Apps
        </Button>
      </Box>
      <LineDivider mb="0" />
      {hasLegacyStakes ? (
        <BalanceTree stake={stake} />
      ) : (
        <>
          <BodyMd mt="6" mb="3">
            Total Staked Balance
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
      {(canTopUpNu || canTopUpKepp) && isStakeAction ? (
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
      ) : stake.stakeType === StakeType.T ? (
        <TokenAmountForm
          innerRef={formRef}
          onSubmitForm={onSubmitForm}
          label={`${isStakeAction ? "Stake" : "Unstake"} Amount`}
          submitButtonText={submitButtonText}
          maxTokenAmount={isStakeAction ? tBalance : stake.tStake}
          shouldDisplayMaxAmountInLabel
        />
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

export default StakeCard
