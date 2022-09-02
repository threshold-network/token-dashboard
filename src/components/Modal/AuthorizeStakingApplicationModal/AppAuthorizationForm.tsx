import AuthorizationCard from "./AuthorizationCard"
import { Form } from "../../Forms"
import { FC } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { getErrorsObj, validateAmountInRange } from "../../../utils/forms"
import {
  Box,
  Button,
  HStack,
  Card,
  LabelMd,
  Badge,
} from "@threshold-network/components"
import { useModal } from "../../../hooks/useModal"
import { TmpAppAuthData, tmpAppAuthData } from "../../../pages/Staking/tmp"

export type FormValues = {
  tbtcAuthorizationAmount: string
  randomBeaconAuthorizationAmount: string
}

interface Props {
  handleSubmit: (vals: any) => void
  tbtcAuthorizationAmount: string
  randomBeaconAuthorizationAmount: string
  appsAuthData: { [app: string]: TmpAppAuthData }
}

export const formikWrapper = withFormik<Props, FormValues>({
  handleSubmit: (values) => {
    console.log("submitted the form", values)
  },
  mapPropsToValues: (props) => ({
    tbtcAuthorizationAmount: props.tbtcAuthorizationAmount,
    randomBeaconAuthorizationAmount: props.randomBeaconAuthorizationAmount,
  }),
  validate: (values, props) => {
    console.log("alllrighty ", values, props)
    const errors: FormikErrors<FormValues> = {}

    errors.tbtcAuthorizationAmount = validateAmountInRange(
      values.tbtcAuthorizationAmount,
      props.appsAuthData.tbtc.max.toString(),
      props.appsAuthData.tbtc.min.toString()
    )

    errors.randomBeaconAuthorizationAmount = validateAmountInRange(
      values.tbtcAuthorizationAmount,
      props.appsAuthData.randomBeacon.max.toString(),
      props.appsAuthData.randomBeacon.min.toString()
    )
    return getErrorsObj(errors)
  },
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
