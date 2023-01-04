import {
  BoxProps,
  Card,
  Checkbox,
  FilterTab,
  FilterTabs,
  Grid,
  GridItem,
  BodyMd,
  BodyLg,
  H5,
  Box,
  BodySm,
  Button,
  useBoolean,
  Progress,
  HStack,
} from "@threshold-network/components"
import { InfoIcon } from "@chakra-ui/icons"
import { FC, RefObject, useCallback, useEffect } from "react"
import { FormValues } from "../../../../components/Forms"
import { AppAuthorizationInfo } from "./AppAuthorizationInfo"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { StakingAppName } from "../../../../store/staking-applications"
import { FormikProps } from "formik"
import {
  useStakingApplicationAddress,
  useStakingApplicationDecreaseDelay,
  useUpdateOperatorStatus,
} from "../../../../hooks/staking-applications"
import InfoBox from "../../../../components/InfoBox"
import { formatDate } from "../../../../utils/date"
import { calculatePercenteage } from "../../../../utils/percentage"
import { StakingAppForm } from "../../../../components/StakingApplicationForms"
import { AuthorizationStatus } from "../../../../types"

interface CommonProps {
  stakingAppId: StakingAppName | "pre"
  label: string
}

type StakingAppAuthDataBaseProps = {
  status: Exclude<AuthorizationStatus, "authorization-not-required">
  authorizedStake: string
  percentage: number
  pendingAuthorizationDecrease: string
  isDeauthorizationReqestActive: boolean
  /**
   * Timestamp when the deauthorization request was created. Takes an
   * `undefined` value if it cannot be estimated.
   */
  deauthorizationCreatedAt?: string
  /**
   * Time in seconds until the deauthorization can be completed.
   */
  remainingAuthorizationDecreaseDelay: string
  isOperatorInPool: boolean | undefined
  operator: string
}

type AppAuthDataConditionalProps =
  | {
      status?: Extract<AuthorizationStatus, "authorization-not-required">
      authorizedStake?: never
      percentage?: never
      pendingAuthorizationDecrease?: never
      isDeauthorizationReqestActive?: never
      /**
       * Timestamp when the deauthorization request was created.
       */
      deauthorizationCreatedAt?: never
      /**
       * Time in seconds until the deauthorization can be completed.
       */
      remainingAuthorizationDecreaseDelay?: never
      isOperatorInPool?: never
      operator?: never
    }
  | StakingAppAuthDataBaseProps

export type AppAuthDataProps = CommonProps & AppAuthDataConditionalProps
export type StakingAuthDataProps = CommonProps & StakingAppAuthDataBaseProps

export interface AuthorizeApplicationsCardCheckboxBaseProps extends BoxProps {
  appAuthData: StakingAuthDataProps
  stakingProvider: string
  totalInTStake: string
  onCheckboxClick: (app: StakingAuthDataProps, isChecked: boolean) => void
  isSelected: boolean
  maxAuthAmount: string
  minAuthAmount: string
  canSubmitForm?: boolean
  formRef?: RefObject<FormikProps<FormValues>>
}

export interface AuthorizeApplicationsCardCheckboxProps
  extends Omit<AuthorizeApplicationsCardCheckboxBaseProps, "appAuthData"> {
  appAuthData: AppAuthDataProps
}

const gridTemplate = {
  base: {
    base: `
            "checkbox             checkbox"
            "app-info             app-info"
            "filter-tabs          filter-tabs"
            "token-amount-form    token-amount-form"
          `,
    sm: `
              "checkbox        app-info"
              "checkbox        filter-tabs"
              "checkbox        token-amount-form"
            `,
    md: `
              "checkbox        app-info           filter-tabs      "
              "checkbox        app-info           _      "
              "checkbox        token-amount-form  token-amount-form"
              "checkbox        token-amount-form  token-amount-form"
            `,
  },
  authorized: {
    base: `
            "app-info             app-info"
            "filter-tabs          filter-tabs"
            "token-amount-form    token-amount-form"
          `,
    sm: `
              "app-info                 app-info"
              "filter-tabs              filter-tabs"
              "token-amount-form        token-amount-form"
            `,
    md: `
              "app-info        app-info           filter-tabs      "
              "app-info        app-info           _      "
              "token-amount-form        token-amount-form  token-amount-form"
              "token-amount-form        token-amount-form  token-amount-form"
            `,
  },
}

const authStatusToAppCardBordColor: Record<
  Exclude<AuthorizationStatus, "authorization-not-required">,
  string | undefined
> = {
  authorized: "green.400",
  "pending-deauthorization": "yellow.400",
  "deauthorization-initiation-needed": "red.400",
  "to-authorize": undefined,
}

export const AuthorizeApplicationsCardCheckboxBase: FC<
  AuthorizeApplicationsCardCheckboxBaseProps
> = ({
  appAuthData,
  onCheckboxClick,
  isSelected,
  maxAuthAmount,
  minAuthAmount,
  stakingProvider,
  totalInTStake,
  formRef,
  canSubmitForm = true,
  ...restProps
}) => {
  const [isIncreaseAction, actionCallbacks] = useBoolean(true)

  const { openModal } = useModal()
  const stakingAppAddress = useStakingApplicationAddress(
    appAuthData.stakingAppId as StakingAppName
  )
  const stakingAppAuthDecreaseDelay = useStakingApplicationDecreaseDelay(
    appAuthData.stakingAppId as StakingAppName
  )

  const { sendTransaction: sendUpdateOperatorStatus } = useUpdateOperatorStatus(
    appAuthData.stakingAppId as StakingAppName
  )

  const updateOperatorStatus = async () => {
    await sendUpdateOperatorStatus(appAuthData.operator!)
  }

  const status = appAuthData.status

  const hasPendingDeauthorization = status === "pending-deauthorization"
  const shouldActivateDeatuhorizationRequest =
    status === "deauthorization-initiation-needed"
  const pendingAuthorizationDecrease =
    appAuthData.pendingAuthorizationDecrease || "0"
  const deauthorizationCreatedAt = appAuthData.deauthorizationCreatedAt
  const remainingAuthorizationDecreaseDelay =
    appAuthData.remainingAuthorizationDecreaseDelay
  const authorizedStake = appAuthData.authorizedStake
  const canDecrease = authorizedStake !== "0"

  useEffect(() => {
    if (hasPendingDeauthorization || shouldActivateDeatuhorizationRequest) {
      actionCallbacks.off()
    } else {
      actionCallbacks.on()
    }
  }, [
    hasPendingDeauthorization,
    shouldActivateDeatuhorizationRequest,
    actionCallbacks,
  ])

  const onFilterTabClick = useCallback(
    (tabId: string) => {
      if (tabId === "increase" && !hasPendingDeauthorization) {
        actionCallbacks.on()
        formRef?.current?.resetForm()
      } else if (tabId === "decrease" && authorizedStake !== "0") {
        actionCallbacks.off()
        formRef?.current?.resetForm()
      }
    },
    [actionCallbacks, authorizedStake, hasPendingDeauthorization]
  )

  const onAuthorizeApp = async (tokenAmount: string) => {
    if (status === "to-authorize") {
      // We want to display different modals for the authroization and for the
      // increase aturhoziation.
      openModal(ModalType.AuthorizeStakingApps, {
        stakingProvider,
        totalInTStake,
        applications: [
          {
            appName: appAuthData.label,
            authorizationAmount: tokenAmount,
            address: stakingAppAddress,
          },
        ],
      })
    } else {
      openModal(ModalType.IncreaseAuthorization, {
        stakingProvider,
        increaseAmount: tokenAmount,
        stakingAppName: appAuthData.stakingAppId,
      })
    }
  }

  const onInitiateDeauthorization = async (tokenAmount: string) => {
    openModal(ModalType.DeauthorizeApplication, {
      stakingProvider: stakingProvider,
      decreaseAmount: tokenAmount,
      stakingAppName: appAuthData.stakingAppId,
      operator: appAuthData.operator,
      isOperatorInPool: appAuthData.isOperatorInPool,
    })
  }

  const onSubmitForm = (tokenAmount: string) => {
    if (isIncreaseAction) onAuthorizeApp(tokenAmount)
    else onInitiateDeauthorization(tokenAmount)
  }

  const onConfirmDeauthorization = () => {
    openModal(ModalType.ConfirmDeauthorization, {
      stakingProvider,
      stakingAppName: appAuthData.stakingAppId,
      decreaseAmount: appAuthData.pendingAuthorizationDecrease,
    })
  }

  return (
    <Card
      {...restProps}
      boxShadow="none"
      borderColor={
        isSelected ? "brand.500" : authStatusToAppCardBordColor[status]
      }
    >
      <Grid
        gridTemplateAreas={
          status !== "to-authorize"
            ? gridTemplate.authorized
            : gridTemplate.base
        }
        gridTemplateColumns={"1fr 18fr"}
        gap="3"
        p={0}
      >
        {status === "to-authorize" && (
          <Checkbox
            isDisabled={!canSubmitForm}
            isChecked={isSelected}
            gridArea="checkbox"
            alignSelf={"flex-start"}
            justifySelf={"center"}
            size="lg"
            onChange={(e) => {
              onCheckboxClick(appAuthData, e.target.checked)
            }}
          />
        )}
        <AppAuthorizationInfo
          status={status}
          stakingAppName={appAuthData.stakingAppId}
          gridArea="app-info"
          authorizedStake={appAuthData.authorizedStake}
          label={appAuthData.label}
          percentageAuthorized={appAuthData.percentage}
        />
        <FilterTabs
          gridArea="filter-tabs"
          variant="inline"
          alignItems="center"
          gap={0}
          size="sm"
          onTabClick={onFilterTabClick}
          selectedTabId={isIncreaseAction ? "increase" : "decrease"}
        >
          <FilterTab
            tabId="increase"
            disabled={hasPendingDeauthorization}
            pointerEvents={hasPendingDeauthorization ? "none" : undefined}
          >
            Increase
          </FilterTab>
          <FilterTab
            tabId="decrease"
            disabled={!canDecrease}
            pointerEvents={canDecrease ? undefined : "none"}
          >
            Decrease
          </FilterTab>
        </FilterTabs>
        {status !== "pending-deauthorization" &&
          status !== "deauthorization-initiation-needed" && (
            <GridItem gridArea="token-amount-form" mt={5}>
              <StakingAppForm
                innerRef={formRef}
                onSubmitForm={onSubmitForm}
                submitButtonText={
                  isIncreaseAction
                    ? status === "authorized"
                      ? `Authorize Increase`
                      : `Authorize ${appAuthData.label}`
                    : "Initiate Deauthorization"
                }
                isDisabled={!canSubmitForm}
                totalStake={totalInTStake}
                placeholder={"Enter amount"}
                minimumAuthorizationAmount={minAuthAmount}
                authorizedAmount={appAuthData.authorizedStake}
                helperText={
                  status === "authorized" && isIncreaseAction
                    ? undefined
                    : `Minimum ${formatTokenAmount(minAuthAmount)} T for ${
                        appAuthData.label
                      }`
                }
                isAuthorization={isIncreaseAction}
              />
            </GridItem>
          )}
      </Grid>
      {(hasPendingDeauthorization || shouldActivateDeatuhorizationRequest) && (
        <Deauthorization
          pendingAuthorizationDecrease={pendingAuthorizationDecrease}
          remainingAuthorizationDecreaseDelay={
            remainingAuthorizationDecreaseDelay!
          }
          deauthorizationCreatedAt={deauthorizationCreatedAt}
          stakingAppAuthDecreaseDelay={stakingAppAuthDecreaseDelay}
          onConfirmDeauthorization={onConfirmDeauthorization}
          onActivateDeauthorizationRequest={updateOperatorStatus}
          status={status}
        />
      )}
    </Card>
  )
}

const Deauthorization: FC<{
  pendingAuthorizationDecrease: string
  remainingAuthorizationDecreaseDelay: string
  deauthorizationCreatedAt: string | undefined
  stakingAppAuthDecreaseDelay: string
  onConfirmDeauthorization: () => void
  onActivateDeauthorizationRequest: () => void
  status: AuthorizationStatus
}> = ({
  pendingAuthorizationDecrease,
  remainingAuthorizationDecreaseDelay,
  deauthorizationCreatedAt,
  stakingAppAuthDecreaseDelay,
  onConfirmDeauthorization,
  onActivateDeauthorizationRequest,
  status,
}) => {
  const progressBarValue =
    remainingAuthorizationDecreaseDelay === "0"
      ? 100
      : status === "deauthorization-initiation-needed"
      ? 0
      : calculatePercenteage(
          +stakingAppAuthDecreaseDelay - +remainingAuthorizationDecreaseDelay,
          stakingAppAuthDecreaseDelay
        )

  return (
    <>
      <BodyMd>Pending Deauthorization</BodyMd>
      <InfoBox
        p="6"
        direction={{ base: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        bg={
          status === "deauthorization-initiation-needed" ? "red.50" : undefined
        }
      >
        <H5>
          {formatTokenAmount(pendingAuthorizationDecrease)}{" "}
          <BodyLg as="span">T</BodyLg>
        </H5>
        <Box minWidth="220px">
          <>
            <Progress
              h="2"
              borderRadius="md"
              colorScheme="brand"
              value={progressBarValue}
            />
            <BodySm mt="2">
              {status === "deauthorization-initiation-needed" && (
                <>
                  Available:{" "}
                  <BodySm as="span" color="brand.500">
                    --/--/--
                  </BodySm>
                </>
              )}
              {status === "pending-deauthorization" &&
                remainingAuthorizationDecreaseDelay === "0" &&
                "Completed"}

              {status === "pending-deauthorization" &&
                remainingAuthorizationDecreaseDelay !== "0" &&
                deauthorizationCreatedAt !== undefined && (
                  <>
                    Available:{" "}
                    <BodySm as="span" color="brand.500">
                      {formatDate(
                        +deauthorizationCreatedAt + +stakingAppAuthDecreaseDelay
                      )}
                    </BodySm>
                  </>
                )}
            </BodySm>
          </>
        </Box>
        {status === "pending-deauthorization" && (
          <Button
            onClick={onConfirmDeauthorization}
            disabled={remainingAuthorizationDecreaseDelay !== "0"}
          >
            Confirm Deauthorization
          </Button>
        )}
        {status === "deauthorization-initiation-needed" && (
          <Button onClick={onActivateDeauthorizationRequest}>
            Activate Deauthorization Request
          </Button>
        )}
      </InfoBox>
      <HStack mt="4" spacing="2">
        <InfoIcon color="gray.500" />
        <BodySm as="span" color="gray.500">
          Increasing or decreasing the authorization amount is suspended until
          the pending deauthorization is confirmed.
        </BodySm>
      </HStack>
    </>
  )
}

export const AuthorizeApplicationsCardCheckbox: FC<
  AuthorizeApplicationsCardCheckboxProps
> = ({
  appAuthData,
  onCheckboxClick,
  isSelected,
  maxAuthAmount,
  minAuthAmount,
  stakingProvider,
  totalInTStake,
  formRef,
  canSubmitForm = true,
  ...restProps
}) => {
  const status = appAuthData.status

  if (!status || status === "authorization-not-required") {
    return (
      <Card {...restProps} boxShadow="none">
        <AppAuthorizationInfo
          stakingAppName={appAuthData.stakingAppId}
          label={appAuthData.label}
          percentageAuthorized={100}
        />
      </Card>
    )
  }

  return (
    <AuthorizeApplicationsCardCheckboxBase
      appAuthData={appAuthData as StakingAuthDataProps}
      onCheckboxClick={onCheckboxClick}
      isSelected={isSelected}
      maxAuthAmount={maxAuthAmount}
      minAuthAmount={minAuthAmount}
      stakingProvider={stakingProvider}
      totalInTStake={totalInTStake}
      formRef={formRef}
      canSubmitForm={canSubmitForm}
      {...restProps}
    />
  )
}

export default AuthorizeApplicationsCardCheckbox
