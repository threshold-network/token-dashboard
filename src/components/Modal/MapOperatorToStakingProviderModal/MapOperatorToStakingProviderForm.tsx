import { FC, Ref, forwardRef } from "react"
import { FormikProps, FormikErrors, Formik, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"
import { isAddressZero, isSameETHAddress } from "../../../web3/utils"

export type MapOperatorToStakingProviderFormValues = {
  operator: string
  appName: string
  mappedOperatorTbtc?: string
  mappedOperatorRandomBeacon?: string
  mappedOperatorTaco?: string
  innerRef: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
}

type ComponentProps = {
  formId: string
  innerRef: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
}

const MapOperatorToStakingProviderFormBase: FC<
  ComponentProps & FormikProps<MapOperatorToStakingProviderFormValues>
> = ({ formId, values }, ref) => {
  return (
    <Form id={formId}>
      <FormikInput
        name="operator"
        label="Operator Address"
        helperText="The address generated during client setup and used by the client software."
      />
    </Form>
  )
}

const validateInputtedOperatorAddress = async (
  operator: string,
  appName: string,
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string,
    appName: string
  ) => Promise<boolean>,
  mappedOperatorTbtc?: string,
  mappedOperatorRandomBeacon?: string
): Promise<string | undefined> => {
  let validationMsg: string | undefined = ""

  try {
    const isOperatorMappedToAnotherStakingProvider =
      await checkIfOperatorIsMappedToAnotherStakingProvider(operator, appName)
    validationMsg = undefined
    if (isOperatorMappedToAnotherStakingProvider) {
      validationMsg = "Operator is already mapped to another staking provider."
    }

    switch (appName) {
      case "tbtc":
        if (mappedOperatorTbtc) {
          if (
            !isAddressZero(mappedOperatorTbtc) &&
            !isSameETHAddress(operator, mappedOperatorTbtc)
          ) {
            validationMsg =
              "The operator address doesn't match the one used in tbtc app"
          }
        }
        break
      case "randomBeacon":
        if (mappedOperatorRandomBeacon) {
          if (
            !isAddressZero(mappedOperatorRandomBeacon) &&
            !isSameETHAddress(operator, mappedOperatorRandomBeacon)
          ) {
            validationMsg =
              "The operator address doesn't match the one used in random beacon app"
          }
        }
        break
      case "taco":
        console.log("taco")
        break
      default:
        throw new Error(`Unsupported app name: ${appName}`)
    }
  } catch (error) {
    console.error("`MapOperatorToStakingProviderForm` validation error.", error)
    validationMsg = (error as Error)?.message
  }

  return validationMsg
}

type MapOperatorToStakingProviderFormProps = {
  appName: string
  mappedOperatorTbtc?: string
  mappedOperatorRandomBeacon?: string
  mappedOperatorTaco?: string
  innerRef: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string,
    appName: string
  ) => Promise<boolean>
} & ComponentProps

const MapOperatorToStakingProviderForm = withFormik<
  MapOperatorToStakingProviderFormProps,
  MapOperatorToStakingProviderFormValues
>({
  validate: async (values, props) => {
    const {
      mappedOperatorTbtc,
      mappedOperatorRandomBeacon,
      checkIfOperatorIsMappedToAnotherStakingProvider,
    } = props
    const errors: FormikErrors<MapOperatorToStakingProviderFormValues> = {}

    errors.operator = validateETHAddress(values.operator)
    if (!errors.operator) {
      errors.operator = await validateInputtedOperatorAddress(
        values.operator,
        values.appName,
        checkIfOperatorIsMappedToAnotherStakingProvider,
        mappedOperatorTbtc,
        mappedOperatorRandomBeacon
      )
    }

    return getErrorsObj(errors)
  },
  handleSubmit: () => {},
  displayName: "MapOperatorToStakingProviderFor",
})((props) => (
  <MapOperatorToStakingProviderFormBase {...props} innerRef={props.innerRef} />
))

export default MapOperatorToStakingProviderForm
