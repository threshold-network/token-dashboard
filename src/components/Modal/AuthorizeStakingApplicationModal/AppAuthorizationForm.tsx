import AuthorizationCard from "./AuthorizationCard"
import { Form } from "../../Forms"
import { FC, useState } from "react"
import { Formik, FormikErrors, FormikProps, withFormik } from "formik"
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
import { StakeData } from "../../../types"

export type FormValues = {
  tbtcAuthorizationAmount: string
  tbtcChecked: boolean
  randomBeaconAuthorizationAmount: string
  randomBeaconChecked: boolean
}

interface Props {
  stake: StakeData
  handleSubmit: (vals: any) => void
  appsAuthData: { [app: string]: TmpAppAuthData }
}

export const formikWrapper = withFormik<Props, FormValues>({
  handleSubmit: (values) => {
    console.log("submitted the form", values)
  },
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

const AppAuthorizationForm: FC<Props & FormikProps<FormValues>> = ({
  appsAuthData,
  stake,
  ...formikProps
}) => {
  console.log("YO YO YO", formikProps)
  const { closeModal } = useModal()

  return (
    <Formik
      initialValues={{
        tbtcAuthorizationAmount: 0,
        tbtcChecked: false,
        randomBeaconAuthorizationAmount: 0,
        randomBeaconChecked: true,
      }}
      onSubmit={(v) => console.log("something...", v)}
    >
      {() => (
        <Form>
          <AuthorizationCard
            mb={6}
            stake={stake}
            formikProps={formikProps}
            appAuthData={tmpAppAuthData.tbtc}
          />
          <AuthorizationCard
            mb={6}
            stake={stake}
            formikProps={formikProps}
            appAuthData={tmpAppAuthData.randomBeacon}
          />
          <Card bg="gray.50" boxShadow="none" mb={6}>
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
      )}
    </Formik>
  )
}

export default formikWrapper(AppAuthorizationForm)
