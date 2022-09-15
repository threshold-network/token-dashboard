import { Form } from "../../Forms"
import { FC } from "react"
import { FormikErrors, FormikProps, useField, withFormik } from "formik"
import { getErrorsObj, validateAmountInRange } from "../../../utils/forms"
import {
  Alert,
  AlertIcon,
  Badge,
  BodyMd,
  BodyXs,
  Box,
  Button,
  Card,
  HStack,
  LabelMd,
} from "@threshold-network/components"
import { useModal } from "../../../hooks/useModal"
import AuthorizationCardNewStaker from "./AuthorizationCardNewStaker"

export type FormValues = {
  tbtcAmountToAuthorize: string | number
  isTbtcChecked: boolean
  randomBeaconAmountToAuthorize: string | number
  isRandomBeaconChecked: boolean
}

export interface AuthInputConstraints {
  min: string | number
  max: string | number
}

interface Props {
  handleSubmit: (vals: any) => void
  tbtcInputConstraints: AuthInputConstraints
  randomBeaconInputConstraints: AuthInputConstraints
}

export const formikWrapper = withFormik<Props, FormValues>({
  handleSubmit: (values) => {
    console.log("submitted the form", values)
  },
  mapPropsToValues: (props) => ({
    tbtcAmountToAuthorize: props.tbtcInputConstraints.max,
    isTbtcChecked: false,
    randomBeaconAmountToAuthorize: props.randomBeaconInputConstraints.max,
    isRandomBeaconChecked: true,
  }),
  validate: (values, props) => {
    const errors: FormikErrors<FormValues> = {}

    errors.tbtcAmountToAuthorize = validateAmountInRange(
      values?.tbtcAmountToAuthorize?.toString(),
      props.tbtcInputConstraints.max.toString(),
      props.tbtcInputConstraints.min.toString()
    )

    errors.randomBeaconAmountToAuthorize = validateAmountInRange(
      values?.tbtcAmountToAuthorize?.toString(),
      props.randomBeaconInputConstraints.max.toString(),
      props.randomBeaconInputConstraints.min.toString()
    )
    return getErrorsObj(errors)
  },
  displayName: "AuthorizationForm",
})

const AppAuthorizationFormNewStaker: FC<Props & FormikProps<FormValues>> = ({
  tbtcInputConstraints,
  randomBeaconInputConstraints,
}) => {
  const { closeModal } = useModal()

  const [, { value: isTbtcChecked }] = useField("isTbtcChecked")
  const [, { value: isRandomBeaconChecked }] = useField("isRandomBeaconChecked")
  const bothAppsChecked = isTbtcChecked && isRandomBeaconChecked

  return (
    <Form>
      <Box bg="brand.50" p={4} borderRadius={6} mb={6}>
        <BodyMd mb={4}>tBTC + Random Beacon Rewards Bundle</BodyMd>
        <AuthorizationCardNewStaker
          min={tbtcInputConstraints.min}
          max={tbtcInputConstraints.max}
          inputId="amountTbtcToAuthorize"
          checkBoxId="isTbtcChecked"
          label="tBTC"
          mb={6}
        />
        <AuthorizationCardNewStaker
          min={randomBeaconInputConstraints.min}
          max={randomBeaconInputConstraints.max}
          inputId="amountRandomBeaconToAuthorize"
          checkBoxId="isRandomBeaconChecked"
          label="Random Beacon"
          mb={6}
        />
        {!bothAppsChecked && (
          <Alert status="error" size="sm">
            <AlertIcon />
            <BodyXs>
              Note that you need to authorize both apps to earn rewards.
            </BodyXs>
          </Alert>
        )}
      </Box>
      <Card bg="gray.50" boxShadow="none" mb={6}>
        <HStack justifyContent="space-between">
          <LabelMd color="gray.500">PRE</LabelMd>
          <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
            Authorization not required
          </Badge>
        </HStack>
      </Card>
      <Box mb={6}>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={isTbtcChecked === false && isRandomBeaconChecked === false}
          type="submit"
        >
          Authorize Selected Apps
        </Button>
      </Box>
    </Form>
  )
}

export default formikWrapper(AppAuthorizationFormNewStaker)
