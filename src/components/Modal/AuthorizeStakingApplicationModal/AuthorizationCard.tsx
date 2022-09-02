import { FC } from "react"
import {
  BoxProps,
  Card,
  Checkbox,
  Grid,
  GridItem,
  BodyMd,
} from "@threshold-network/components"
import { AppAuthorizationInfo } from "../../../pages/Staking/AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox/AppAuthorizationInfo"
import { TmpAppAuthData } from "../../../pages/Staking/tmp"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { FormikTokenBalanceInput } from "../../Forms/FormikTokenBalanceInput"
import { HStack } from "@chakra-ui/react"

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
  const { label, min, max } = appAuthData
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
          {/*<AppAuthorizationInput appAuthData={appAuthData} {...formikProps} />*/}
          <FormikTokenBalanceInput
            name={`${label}AuthorizationAmount`}
            label={
              <HStack justifyContent="space-between">
                <BodyMd>Authorized Amount</BodyMd>
                <BodyMd>Remaining Balance: 5000</BodyMd>
              </HStack>
            }
            placeholder="Enter amount"
            icon={ThresholdCircleBrand}
            max={max}
            helperText={`Minimum ${formatTokenAmount(min)} T for ${label}`}
            _disabled={{ bg: "gray.50", border: "none" }}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default AuthorizationCard
