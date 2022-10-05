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
} from "../../../../hooks/staking-applications"
import InfoBox from "../../../../components/InfoBox"
import { formatDate } from "../../../../utils/date"
import { calculatePercenteage } from "../../../../utils/percentage"
import { StakingAppForm } from "../../../../components/StakingApplicationForms"

interface CommonProps {
  stakingAppId: StakingAppName | "pre"
  label: string
}

type AppAuthDataConditionalProps =
  | {
      isAuthRequired?: false
      authorizedStake?: never
      hasPendingDeauthorization?: never
      isAuthorized?: never
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
    }
  | {
      isAuthRequired: true
      authorizedStake: string
      hasPendingDeauthorization: boolean
      isAuthorized: boolean
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
    }

export type AppAuthDataProps = CommonProps & AppAuthDataConditionalProps

export interface AuthorizeApplicationsCardCheckboxProps extends BoxProps {
  appAuthData: AppAuthDataProps
  stakingProvider: string
  totalInTStake: string
  onCheckboxClick: (app: AppAuthDataProps, isChecked: boolean) => void
  isSelected: boolean
  maxAuthAmount: string
  minAuthAmount: string
  canSubmitForm?: boolean
  formRef?: RefObject<FormikProps<FormValues>>
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
  const collapsed = !appAuthData.isAuthRequired
  const [isIncreaseAction, actionCallbacks] = useBoolean(true)

  const { openModal } = useModal()
  const stakingAppAddress = useStakingApplicationAddress(
    appAuthData.stakingAppId as StakingAppName
  )
  const stakingAppAuthDecreaseDelay = useStakingApplicationDecreaseDelay(
    appAuthData.stakingAppId as StakingAppName
  )

  const hasPendingDeauthorization = Boolean(
    appAuthData.hasPendingDeauthorization
  )
  const pendingAuthorizationDecrease =
    appAuthData.pendingAuthorizationDecrease || "0"
  const deauthorizationCreatedAt = appAuthData.deauthorizationCreatedAt
  const isDeauthorizationReqestActive =
    appAuthData.isDeauthorizationReqestActive
  const remainingAuthorizationDecreaseDelay =
    appAuthData.remainingAuthorizationDecreaseDelay
  const authorizedStake = appAuthData.authorizedStake
  const canDecrease = authorizedStake !== "0"

  useEffect(() => {
    if (hasPendingDeauthorization) {
      actionCallbacks.off()
    } else {
      actionCallbacks.on()
    }
  }, [hasPendingDeauthorization, actionCallbacks])

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
    if (!appAuthData.isAuthorized) {
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

  if (collapsed) {
    return (
      <Card {...restProps} boxShadow="none">
        <AppAuthorizationInfo
          label={appAuthData.label}
          percentageAuthorized={100}
        />
      </Card>
    )
  }

  return (
    <Card
      {...restProps}
      boxShadow="none"
      borderColor={
        appAuthData.isAuthorized && !hasPendingDeauthorization
          ? "green.400"
          : isSelected
          ? "brand.500"
          : hasPendingDeauthorization
          ? "yellow.400"
          : undefined
      }
    >
      <Grid
        gridTemplateAreas={
          appAuthData.isAuthorized ? gridTemplate.authorized : gridTemplate.base
        }
        gridTemplateColumns={"1fr 18fr"}
        gap="3"
        p={0}
      >
        {!appAuthData.isAuthorized && (
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
          gridArea="app-info"
          authorizedStake={appAuthData.authorizedStake}
          isAuthorized={appAuthData.isAuthorized}
          label={appAuthData.label}
          percentageAuthorized={appAuthData.percentage}
          isAuthorizationRequired={true}
          hasPendingDeauthorization={hasPendingDeauthorization}
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
        {!hasPendingDeauthorization && (
          <GridItem gridArea="token-amount-form" mt={5}>
            <StakingAppForm
              innerRef={formRef}
              onSubmitForm={onSubmitForm}
              submitButtonText={
                isIncreaseAction
                  ? appAuthData.isAuthorized
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
                appAuthData.isAuthorized && isIncreaseAction
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
      {hasPendingDeauthorization && (
        <>
          <BodyMd>Pending Deauthorization</BodyMd>
          <InfoBox
            p="6"
            direction={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
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
                  value={
                    remainingAuthorizationDecreaseDelay === "0"
                      ? 100
                      : !isDeauthorizationReqestActive
                      ? 0
                      : calculatePercenteage(
                          remainingAuthorizationDecreaseDelay,
                          stakingAppAuthDecreaseDelay
                        )
                  }
                />
                <BodySm mt="2">
                  {!isDeauthorizationReqestActive &&
                    "Deauthroziation request not activated"}
                  {isDeauthorizationReqestActive &&
                    remainingAuthorizationDecreaseDelay === "0" &&
                    "Completed"}
                  {isDeauthorizationReqestActive &&
                    remainingAuthorizationDecreaseDelay !== "0" &&
                    deauthorizationCreatedAt !== undefined && (
                      <>
                        Available:{" "}
                        <BodySm as="span" color="brand.500">
                          {formatDate(
                            +deauthorizationCreatedAt +
                              +stakingAppAuthDecreaseDelay
                          )}
                        </BodySm>
                      </>
                    )}
                </BodySm>
              </>
            </Box>
            <Button
              onClick={onConfirmDeauthorization}
              disabled={
                !isDeauthorizationReqestActive ||
                remainingAuthorizationDecreaseDelay !== "0"
              }
            >
              Confirm Deauthorization
            </Button>
          </InfoBox>
          <HStack mt="4" spacing="2">
            <InfoIcon color="gray.500" />
            <BodySm as="span" color="gray.500">
              Increasing or decreasing the authorization amount is suspended
              until the pending deauthorization is confirmed.
            </BodySm>
          </HStack>
        </>
      )}
    </Card>
  )
}

export default AuthorizeApplicationsCardCheckbox
