import { FC, Ref } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"

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

type MapOperatorToStakingProviderFormProps = {
  initialAddress: string
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
    const { checkIfOperatorIsMappedToAnotherStakingProvider } = props
    const errors: FormikErrors<MapOperatorToStakingProviderFormValues> = {}

    errors.operator = validateETHAddress(values.operator)
    if (!errors.operator) {
      let validationMsg: string | undefined = ""
      try {
        const isOperatorMappedToOtherStakingProvider =
          await checkIfOperatorIsMappedToAnotherStakingProvider(values.operator)
        validationMsg = isOperatorMappedToOtherStakingProvider
          ? "Operator is already mapped to another staking provider."
          : undefined
      } catch (error) {
        console.error(
          "`MapOperatorToStakingProviderForm` validation error.",
          error
        )
        validationMsg = (error as Error)?.message
      }
      errors.operator = validationMsg
    }

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MapOperatorToStakingProviderFor",
})(MapOperatorToStakingProviderFormBase)

export default MapOperatorToStakingProviderForm
