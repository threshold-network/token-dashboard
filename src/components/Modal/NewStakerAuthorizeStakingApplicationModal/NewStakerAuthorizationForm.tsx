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
import NewStakerAuthorizationCard from "./NewStakerAuthorizationCard"

export type FormValues = {
  tbtcAmountToAuthorize: string | number
  isTbtcChecked: boolean
  randomBeaconAmountToAuthorize: string | number
  isRandomBeaconChecked: boolean
  tacoAmountToAuthorize: string | number
  isTacoChecked: boolean
}

export interface AuthInputConstraints {
  min: string | number
  max: string | number
}

interface Props {
  onSubmitForm: (values: FormValues) => void
  tbtcInputConstraints: AuthInputConstraints
  randomBeaconInputConstraints: AuthInputConstraints
  tacoInputConstraints: AuthInputConstraints
}

export const formikWrapper = withFormik<Props, FormValues>({
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  mapPropsToValues: (props) => ({
    tbtcAmountToAuthorize: props.tbtcInputConstraints.max,
    isTbtcChecked: true,
    randomBeaconAmountToAuthorize: props.randomBeaconInputConstraints.max,
    isRandomBeaconChecked: true,
    tacoAmountToAuthorize: props.tacoInputConstraints.max,
    isTacoChecked: true,
  }),
  validate: (values, props) => {
    const errors: FormikErrors<FormValues> = {}

    errors.tbtcAmountToAuthorize = validateAmountInRange(
      values?.tbtcAmountToAuthorize?.toString(),
      props.tbtcInputConstraints.max.toString(),
      props.tbtcInputConstraints.min.toString()
    )

    errors.randomBeaconAmountToAuthorize = validateAmountInRange(
      values?.randomBeaconAmountToAuthorize?.toString(),
      props.randomBeaconInputConstraints.max.toString(),
      props.randomBeaconInputConstraints.min.toString()
    )

    errors.tacoAmountToAuthorize = validateAmountInRange(
      values?.tacoAmountToAuthorize?.toString(),
      props.tacoInputConstraints.max.toString(),
      props.tacoInputConstraints.min.toString()
    )
    return getErrorsObj(errors)
  },
  displayName: "AuthorizationForm",
})

const NewStakerAuthorizationForm: FC<Props & FormikProps<FormValues>> = ({
  tbtcInputConstraints,
  randomBeaconInputConstraints,
  tacoInputConstraints,
  handleSubmit,
}) => {
  const { closeModal } = useModal()
  const [, { value: isTbtcChecked }] = useField("isTbtcChecked")
  const [, { value: isRandomBeaconChecked }] = useField("isRandomBeaconChecked")
  const [, { value: isTacoChecked }] = useField("isTacoChecked")
  const bothAppsChecked = isTbtcChecked && isRandomBeaconChecked

  return (
    <Form onSubmit={handleSubmit}>
      <Box bg="brand.50" p={4} borderRadius={6} mb={6}>
        <BodyMd mb={4}>tBTC + Random Beacon Rewards Bundle</BodyMd>
        <NewStakerAuthorizationCard
          stakingAppName="tbtc"
          min={tbtcInputConstraints.min}
          max={tbtcInputConstraints.max}
          inputId="tbtcAmountToAuthorize"
          checkBoxId="isTbtcChecked"
          label="tBTC"
          mb={6}
        />
        <NewStakerAuthorizationCard
          stakingAppName="randomBeacon"
          min={randomBeaconInputConstraints.min}
          max={randomBeaconInputConstraints.max}
          inputId="randomBeaconAmountToAuthorize"
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
        <NewStakerAuthorizationCard
          stakingAppName="taco"
          min={tacoInputConstraints.min}
          max={tacoInputConstraints.max}
          inputId="tacoAmountToAuthorize"
          checkBoxId="isTacoChecked"
          label="TACo"
          mb={6}
        />
      </Box>
      <HStack mb={6} justifyContent="flex-end">
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={
            isTbtcChecked === false &&
            isRandomBeaconChecked === false &&
            isTacoChecked === false
          }
          type="submit"
        >
          Authorize Selected Apps
        </Button>
      </HStack>
    </Form>
  )
}

export default formikWrapper(NewStakerAuthorizationForm)
