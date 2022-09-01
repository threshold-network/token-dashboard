import { FC } from "react"
import {
  BoxProps,
  Card,
  Checkbox,
  Grid,
  GridItem,
} from "@threshold-network/components"
import { AppAuthorizationInfo } from "../../../pages/Staking/AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox/AppAuthorizationInfo"
import AppAuthorizationInput from "./AppAuthorizationInput"
import { TmpAppAuthData } from "../../../pages/Staking/tmp"
import app from "../../../App"

export interface AuthorizationCardProps extends BoxProps {
  appAuthData: TmpAppAuthData
  onCheckboxClick: (app: TmpAppAuthData, isChecked: boolean) => void
  isSelected: boolean
  formikProps: any
}

export const AuthorizationCard: FC<AuthorizationCardProps> = ({
  appAuthData,
  onCheckboxClick,
  isSelected,
  formikProps,
  ...restProps
}) => {
  console.log("received app aith data ", appAuthData)
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
          separatePercentAuthorized
        />
        <GridItem gridArea="token-amount-form" mt={5}>
          <AppAuthorizationInput appAuthData={appAuthData} {...formikProps} />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default AuthorizationCard
