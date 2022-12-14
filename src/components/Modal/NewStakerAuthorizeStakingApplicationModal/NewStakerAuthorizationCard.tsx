import { FC, useMemo } from "react"
import {
  BodyMd,
  BodySm,
  BoxProps,
  Card,
  Checkbox,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Link,
} from "@threshold-network/components"
import { Field, FieldProps, useField } from "formik"
import { BigNumber } from "ethers"
import {
  AppAuthorizationInfo,
  AppAuthorizationInfoProps,
} from "../../../pages/Staking/AuthorizeStakingApps/AuthorizeApplicationsCardCheckbox/AppAuthorizationInfo"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { FormikTokenBalanceInput } from "../../Forms/FormikTokenBalanceInput"
import { calculatePercenteage } from "../../../utils/percentage"

export interface NewStakerAuthorizationCardProps extends BoxProps {
  max: string | number
  min: string | number
  inputId: string
  checkBoxId: string
  label: string
  stakingAppName: AppAuthorizationInfoProps["stakingAppName"]
}

export const NewStakerAuthorizationCard: FC<
  NewStakerAuthorizationCardProps
> = ({
  max,
  min,
  inputId,
  checkBoxId,
  label,
  stakingAppName,
  ...restProps
}) => {
  const [, { value: inputValue }, { setValue }] = useField(inputId)
  const [, { value: checkboxValue }] = useField(checkBoxId)

  const calculateRemainingAmount = () => {
    if (inputValue) {
      if (BigNumber.from(inputValue).gte(BigNumber.from(max))) {
        return "0"
      }
      return formatTokenAmount(BigNumber.from(max).sub(inputValue).toString())
    }

    return formatTokenAmount(max)
  }

  const percentToBeAuthorized = calculatePercenteage(inputValue, max)
  const remainingAmount = calculateRemainingAmount()

  return (
    <Card
      {...restProps}
      boxShadow="none"
      borderColor={checkboxValue === true ? "brand.500" : undefined}
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
        <Field name={checkBoxId}>
          {({ field }: FieldProps) => {
            const { value } = field
            return (
              <FormControl>
                <Checkbox
                  isChecked={value}
                  gridArea="checkbox"
                  alignSelf={"flex-start"}
                  justifySelf={"center"}
                  size="lg"
                  {...field}
                />
              </FormControl>
            )
          }}
        </Field>
        <AppAuthorizationInfo
          stakingAppName={stakingAppName}
          gridArea="app-info"
          label={label}
          status={"to-authorize"}
          percentageAuthorized={percentToBeAuthorized}
        />
        <GridItem gridArea="token-amount-form" mt={5}>
          <FormikTokenBalanceInput
            name={inputId}
            label={
              <HStack justifyContent="space-between">
                <BodyMd fontWeight="bold">Amount</BodyMd>
                <BodySm color="gray.500">
                  Remaining Balance: {remainingAmount} T
                </BodySm>
              </HStack>
            }
            placeholder="Enter amount"
            icon={ThresholdCircleBrand}
            max={max}
            helperText={
              <BodySm>
                <Link color="brand.500" mr={2} onClick={() => setValue(min)}>
                  Minimum
                </Link>
                {formatTokenAmount(min)} T for {label}
              </BodySm>
            }
            _disabled={{ bg: "gray.50", border: "none" }}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}

export default NewStakerAuthorizationCard
