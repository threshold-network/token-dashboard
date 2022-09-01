import AuthorizationCard from "./AuthorizationCard"
import { Form } from "../../Forms"
import { FC } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { FormValues } from "./AppAuthorizationInput"
import {
  DEFAULT_MIN_VALUE,
  getErrorsObj,
  validateAmountInRange,
} from "../../../utils/forms"
import {
  Box,
  Button,
  HStack,
  Card,
  LabelMd,
  Badge,
} from "@threshold-network/components"
import { useModal } from "../../../hooks/useModal"
import { tmpAppAuthData } from "../../../pages/Staking/tmp"

interface Props {}

export const formikWrapper = withFormik<Props, FormValues>({
  handleSubmit: (values) => {
    console.log("submitted the form", values)
  },
  // mapPropsToValues: (props) => ({
  //   authorizationAmount: props.maxAuthAmount,
  // }),
  // validate: (values, props) => {
  //   const errors: FormikErrors<FormValues> = {}
  //
  //   errors.authorizationAmount = validateAmountInRange(
  //     values.authorizationAmount,
  //     props.maxAuthAmount.toString(),
  //     props.minAuthAmount ? props.minAuthAmount.toString() : DEFAULT_MIN_VALUE
  //   )
  //   return getErrorsObj(errors)
  // },
  displayName: "AuthorizationForm",
})

const AppAuthorizationForm: FC<Props & FormikProps<FormValues>> = (
  formikProps
) => {
  const { closeModal } = useModal()

  console.log("sending this ", tmpAppAuthData)

  return (
    <Form>
      <AuthorizationCard
        formikProps={formikProps}
        appAuthData={tmpAppAuthData.tbtc}
        isSelected
        onCheckboxClick={() => {}}
      />
      <AuthorizationCard
        formikProps={formikProps}
        appAuthData={tmpAppAuthData.randomBeacon}
        isSelected
        onCheckboxClick={() => {}}
      />
      <Card bg="gray.50" boxShadow="none">
        <HStack justifyContent="space-between">
          <LabelMd color="gray.500">PRE</LabelMd>
          <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
            Authorization not required
          </Badge>
        </HStack>
      </Card>
      <Box>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button type="submit">Authorize Selected Apps</Button>
      </Box>
    </Form>
  )
}

export default formikWrapper(AppAuthorizationForm)
