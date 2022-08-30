import {
  Card,
  FilterTabs,
  BoxProps,
  Grid,
  Checkbox,
  GridItem,
} from "@threshold-network/components"
import { FC } from "react"
import { TokenAmountForm } from "../../../../components/Forms"
import { Token } from "../../../../enums"
import { useMinStakeAmount } from "../../../../hooks/useMinStakeAmount"
import { useTokenBalance } from "../../../../hooks/useTokenBalance"
import { AppAuthorizationInfo } from "./AppAuthorizationInfo"

export interface AppAuthDataProps {
  label: string
  isAuthorized: boolean
  percentage: number
  isAuthRequired: boolean
}

export interface AuthorizeApplicationsCardCheckboxProps extends BoxProps {
  appAuthData: AppAuthDataProps
  onCheckboxClick: (app: AppAuthDataProps, isChecked: boolean) => void
  isSelected: boolean
  totalInTStake: string
}

export const AuthorizeApplicationsCardCheckbox: FC<
  AuthorizeApplicationsCardCheckboxProps
> = ({
  appAuthData,
  onCheckboxClick,
  isSelected,
  totalInTStake,
  ...restProps
}) => {
  const tBalance = useTokenBalance(Token.T)
  const minStakeAmount = useMinStakeAmount()
  const collapsed = !appAuthData.isAuthRequired

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
          percentageAuthorized={100}
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
            onSubmitForm={() => {
              console.log("form submitted")
            }}
            label="Amount"
            submitButtonText={`Authorize ${appAuthData.label}`}
            maxTokenAmount={totalInTStake}
            placeholder={"Enter amount"}
            minTokenAmount={minStakeAmount}
            helperText={`Minimum 40,000 T for ${appAuthData.label}`}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default AuthorizeApplicationsCardCheckbox
