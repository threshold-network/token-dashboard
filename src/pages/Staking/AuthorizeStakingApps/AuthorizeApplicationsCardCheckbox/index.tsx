import {
  Card,
  FilterTabs,
  BoxProps,
  Grid,
  Checkbox,
  GridItem,
  BodyMd,
  H3,
  BodyLg,
  H5,
  Box,
  MultiSegmentProgress,
  BodySm,
  Button,
} from "@threshold-network/components"
import { FC, RefObject } from "react"
import { FormValues, TokenAmountForm } from "../../../../components/Forms"
import { AppAuthorizationInfo } from "./AppAuthorizationInfo"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { WeiPerEther } from "@ethersproject/constants"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import { StakingAppName } from "../../../../store/staking-applications"
import { FormikProps } from "formik"
import { useStakingApplicationAddress } from "../../../../hooks/staking-applications"
import InfoBox from "../../../../components/InfoBox"
import { formatDate } from "../../../../utils/date"

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
      deauthorizationCreatedAt?: never
      remainingAuthorizationDecreaseDelay?: string
    }
  | {
      isAuthRequired: true
      authorizedStake: string
      hasPendingDeauthorization: boolean
      isAuthorized: boolean
      percentage: number
      pendingAuthorizationDecrease: string
      isDeauthorizationReqestActive: boolean
      deauthorizationCreatedAt?: string
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
  ...restProps
}) => {
  const collapsed = !appAuthData.isAuthRequired
  const { openModal } = useModal()
  const stakingAppAddress = useStakingApplicationAddress(
    appAuthData.stakingAppId as StakingAppName
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

  const onConfirmDeauthorization = () => {
    // TODO: Implement submit function.
  }

  if (collapsed) {
    return (
      <Card {...restProps} boxShadow="none">
        <AppAuthorizationInfo
          label={appAuthData.label}
          percentageAuthorized={100}
          aprPercentage={10}
          slashingPercentage={1}
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
          aprPercentage={10}
          slashingPercentage={1}
          isAuthorizationRequired={true}
          hasPendingDeauthorization={hasPendingDeauthorization}
        />
        <FilterTabs
          gridArea="filter-tabs"
          variant="inline"
          alignItems="center"
          gap={0}
          size="sm"
          tabs={[
            { title: "Increase", tabId: "1" },
            { title: "Decrease", tabId: "2" },
          ]}
        />
        <GridItem gridArea="token-amount-form" mt={5}>
          <TokenAmountForm
            innerRef={formRef}
            onSubmitForm={onAuthorizeApp}
            label="Amount"
            submitButtonText={
              appAuthData.isAuthorized
                ? `Authorize Increase`
                : `Authorize ${appAuthData.label}`
            }
            maxTokenAmount={maxAuthAmount}
            placeholder={"Enter amount"}
            minTokenAmount={
              appAuthData.percentage === 0
                ? minAuthAmount
                : WeiPerEther.toString()
            }
            helperText={`Minimum ${formatTokenAmount(minAuthAmount)} T for ${
              appAuthData.label
            }`}
          />
        </GridItem>
      </Grid>
      {hasPendingDeauthorization && (
        <>
          <BodyMd mt="2.5rem !important">Pending Deauthorization</BodyMd>
          <InfoBox
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
                <MultiSegmentProgress
                  values={[
                    {
                      color: "#7D00FF",
                      value:
                        remainingAuthorizationDecreaseDelay === "0"
                          ? 100
                          : !isDeauthorizationReqestActive
                          ? 0
                          : // TODO: calculatePercenteage(
                            //     remainingAuthorizationDecreaseDelay,
                            //     remainingAuthorizationDecreaseDelay +
                            //       stakingAppAuthDecreaseDelay
                            //   ),
                            15,
                    },
                  ]}
                />
                <BodySm>
                  {isDeauthorizationReqestActive
                    ? "Completed"
                    : "Deauthroziation request not activated"}
                </BodySm>
                {deauthorizationCreatedAt && (
                  <BodySm>
                    Available:{" "}
                    <BodySm as="span" color="brand.500">
                      {formatDate(deauthorizationCreatedAt)}
                    </BodySm>
                  </BodySm>
                )}
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
        </>
      )}
    </Card>
  )
}

export default AuthorizeApplicationsCardCheckbox
