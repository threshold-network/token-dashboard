import { Form } from "../../Forms"
import { Box, HStack, BodyMd } from "@threshold-network/components"
import { FC, Ref } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { FormikTokenBalanceInput } from "../../Forms/FormikTokenBalanceInput"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { TmpAppAuthData } from "../../../pages/Staking/tmp"
import app from "../../../App"

export type FormValues = {
  authorizationAmount: string
}

const AppAuthorizationInput: FC<
  { appAuthData: TmpAppAuthData } & FormikProps<FormValues>
> = ({ appAuthData }) => {
  const { label, min, max } = appAuthData
  console.log("label ", label)
  console.log("min ", min)
  console.log("max ", max)
  console.log("-----------")

  return (
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
  )
}

export default AppAuthorizationInput
