import { FC, Ref, forwardRef } from "react"
import { FormikProps, FormikErrors, Formik, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"
import { isAddressZero, isSameETHAddress } from "../../../web3/utils"

export type MapOperatorToStakingProviderFormValues = {
  operator: string
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
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string
  ) => Promise<boolean>,
  mappedOperatorTbtc?: string,
  mappedOperatorRandomBeacon?: string
): Promise<string | undefined> => {
  let validationMsg: string | undefined = ""

  try {
    const isOperatorMappedToAnotherStakingProvider =
      await checkIfOperatorIsMappedToAnotherStakingProvider(operator)
    validationMsg = undefined
    if (isOperatorMappedToAnotherStakingProvider) {
      validationMsg = "Operator is already mapped to another staking provider."
    }

    if (mappedOperatorTbtc && mappedOperatorRandomBeacon) {
      const isOperatorMappedOnlyInTbtc =
        !isAddressZero(mappedOperatorTbtc) &&
        isAddressZero(mappedOperatorRandomBeacon)

      const isOperatorMappedOnlyInRandomBeacon =
        isAddressZero(mappedOperatorTbtc) &&
        !isAddressZero(mappedOperatorRandomBeacon)

      if (
        isOperatorMappedOnlyInRandomBeacon &&
        !isSameETHAddress(operator, mappedOperatorRandomBeacon)
      ) {
        validationMsg =
          "The operator address doesn't match the one used in random beacon app"
      }
      if (
        isOperatorMappedOnlyInTbtc &&
        !isSameETHAddress(operator, mappedOperatorTbtc)
      ) {
        validationMsg =
          "The operator address doesn't match the one used in tbtc app"
      }
    }
  } catch (error) {
    console.error("`MapOperatorToStakingProviderForm` validation error.", error)
    validationMsg = (error as Error)?.message
  }

  return validationMsg
}

type MapOperatorToStakingProviderFormCommonProps = {
  initialAddress: string
  innerRef: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string
  ) => Promise<boolean>
} & ComponentProps

type MapOperatorToStakingProviderFormConditionalProps =
  | {
      mappedOperatorTbtc: string
      mappedOperatorRandomBeacon: string
      mappedOperatorTaco?: never
    }
  | {
      mappedOperatorTbtc?: never
      mappedOperatorRandomBeacon?: never
      mappedOperatorTaco: string
    }

type MapOperatorToStakingProviderFormProps =
  MapOperatorToStakingProviderFormCommonProps &
    MapOperatorToStakingProviderFormConditionalProps

const MapOperatorToStakingProviderForm = withFormik<
  MapOperatorToStakingProviderFormProps,
  MapOperatorToStakingProviderFormValues
>({
  mapPropsToValues: ({ initialAddress }) => ({
    operator: initialAddress,
  }),
  validate: async (values, props) => {
    const {
      mappedOperatorTbtc,
      mappedOperatorRandomBeacon,
      checkIfOperatorIsMappedToAnotherStakingProvider,
    } = props
    const errors: FormikErrors<MapOperatorToStakingProviderFormValues> = {}

    if (values.operator) {
      errors.operator = validateETHAddress(values.operator)
      if (!errors.operator) {
        errors.operator = await validateInputtedOperatorAddress(
          values.operator,
          checkIfOperatorIsMappedToAnotherStakingProvider,
          mappedOperatorTbtc,
          mappedOperatorRandomBeacon
        )
      }
    }

    return getErrorsObj(errors)
  },
  handleSubmit: () => {},
  displayName: "MapOperatorToStakingProviderFor",
})((props) => (
  <MapOperatorToStakingProviderFormBase {...props} innerRef={props.innerRef} />
))

export default MapOperatorToStakingProviderForm
