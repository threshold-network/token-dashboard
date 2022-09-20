import {
  Card,
  FilterTabs,
  FilterTab,
  BoxProps,
  Grid,
  Checkbox,
  GridItem,
} from "@threshold-network/components"
import { FC } from "react"
import { TokenAmountForm } from "../../../../components/Forms"
import { AppAuthorizationInfo } from "./AppAuthorizationInfo"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { WeiPerEther } from "@ethersproject/constants"

export interface AppAuthDataProps {
  label: string
  isAuthorized: boolean
  percentage: number
  isAuthRequired: boolean
}

export interface AuthorizeApplicationsCardCheckboxProps extends BoxProps {
  appAuthData: AppAuthDataProps
  stakingProvider: string
  onCheckboxClick: (app: AppAuthDataProps, isChecked: boolean) => void
  isSelected: boolean
  maxAuthAmount: string
  minAuthAmount: string
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
  ...restProps
}) => {
  const collapsed = !appAuthData.isAuthRequired
  const threshold = useThreshold()

  const onAuthorizeApp = async (tokenAmount: string) => {
    // TODO: Pass the staking provider address as a prop.
    // TODO: Use `useSendtTransacion` hook to open confirmation modal/pending modals/success modal.
    // Just test the transacion. The real flow is diffrent- we should opean confirmation modal then trigger transacion.
    await threshold.multiAppStaking.randomBeacon.increaseAuthorization(
      stakingProvider,
      tokenAmount
    )
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
      borderColor={isSelected ? "brand.500" : undefined}
    >
      <Grid
        gridTemplateAreas={{
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
              "checkbox        token-amount-form  token-amount-form"
              "checkbox        token-amount-form  token-amount-form"
            `,
        }}
        gridTemplateColumns={"1fr 18fr"}
        gap="3"
        p={0}
      >
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
        <AppAuthorizationInfo
          gridArea="app-info"
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
        >
          <FilterTab tabId={"1"}>Increase</FilterTab>
          <FilterTab tabId={"2"}>Decrease</FilterTab>
        </FilterTabs>
        <GridItem gridArea="token-amount-form" mt={5}>
          <TokenAmountForm
            onSubmitForm={onAuthorizeApp}
            label="Amount"
            submitButtonText={`Authorize ${appAuthData.label}`}
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
