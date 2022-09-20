import {
  Card,
  FilterTabs,
  BoxProps,
  Grid,
  Checkbox,
  GridItem,
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

export interface AppAuthDataProps {
  stakingAppId: StakingAppName | "pre"
  label: string
  isAuthorized: boolean
  percentage: number
  isAuthRequired: boolean
  authorizedStake: string
}

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
      openModal(ModalType.IncreaseAuthorizationSuccess, {
        stakingProvider,
        increaseAmount: tokenAmount,
        stakingAppName: appAuthData.stakingAppId,
      })
    }
  }

  if (collapsed) {
    return (
      <Card {...restProps} boxShadow="none">
        <AppAuthorizationInfo
          isAuthorized={appAuthData.isAuthorized}
          authorizedStake={appAuthData.authorizedStake}
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
        appAuthData.isAuthorized
          ? "green.400"
          : isSelected
          ? "brand.500"
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
    </Card>
  )
}

export default AuthorizeApplicationsCardCheckbox
