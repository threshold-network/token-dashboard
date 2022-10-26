import { FC, Ref } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"
import { isAddressZero, isSameETHAddress } from "../../../web3/utils"

export interface MapOperatorToStakingProviderFormValues {
  operator: string
}

type ComponentProps = {
  formId: string
}

const MapOperatorToStakingProviderFormBase: FC<
  ComponentProps & FormikProps<MapOperatorToStakingProviderFormValues>
> = ({ formId, values }) => {
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
  mappedOperatorTbtc: string,
  mappedOperatorRandomBeacon: string
): Promise<string | undefined> => {
  let validationMsg: string | undefined = ""

  try {
    const isOperatorMappedToAnotherStakingProvider =
      await checkIfOperatorIsMappedToAnotherStakingProvider(operator)
    validationMsg = undefined
    if (isOperatorMappedToAnotherStakingProvider) {
      validationMsg = "Operator is already mapped to another staking provider."
    }

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
  } catch (error) {
    console.error("`MapOperatorToStakingProviderForm` validation error.", error)
    validationMsg = (error as Error)?.message
  }

  return validationMsg
}

type MapOperatorToStakingProviderFormProps = {
  initialAddress: string
  mappedOperatorTbtc: string
  mappedOperatorRandomBeacon: string
  innerRef: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string
  ) => Promise<boolean>
  onSubmitForm: (values: MapOperatorToStakingProviderFormValues) => void
} & ComponentProps

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

    errors.operator = validateETHAddress(values.operator)
    if (!errors.operator) {
      errors.operator = await validateInputtedOperatorAddress(
        values.operator,
        checkIfOperatorIsMappedToAnotherStakingProvider,
        mappedOperatorTbtc,
        mappedOperatorRandomBeacon
      )
    }

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MapOperatorToStakingProviderFor",
})(MapOperatorToStakingProviderFormBase)

export default MapOperatorToStakingProviderForm
