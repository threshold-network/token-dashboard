import { FC } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"

interface FormValues {
  stakingProvider: string
  beneficiary: string
  authorizer: string
}

type ComponentProps = {
  formId: string
}

const AdvancedParamsFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId}>
      <FormikInput
        name="stakingProvider"
        label="Provider Address"
        helperText="Enter a staking provider address."
      />
      <FormikInput
        mt="6"
        name="beneficiary"
        label="Beneficiary Address"
        helperText="This address will receive rewards."
      />
      <FormikInput
        mt="6"
        name="authorizer"
        label="Authrozier Address"
        helperText="This authorizer will authorize applications."
      />
    </Form>
  )
}

type AdvancedParamsFormProps = {
  initialAddress: string
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const AdvancedParamsForm = withFormik<AdvancedParamsFormProps, FormValues>({
  mapPropsToValues: ({ initialAddress }) => ({
    authorizer: initialAddress,
    beneficiary: initialAddress,
    stakingProvider: initialAddress,
  }),
  validate: (values, props) => {
    const errors: FormikErrors<FormValues> = {}

    // TODO: check if a staking provider is already in use.
    // https://github.com/threshold-network/token-dashboard/pull/88
    errors.stakingProvider = validateETHAddress(values.stakingProvider)
    errors.beneficiary = validateETHAddress(values.beneficiary)
    errors.authorizer = validateETHAddress(values.authorizer)

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "AdvancedStakingParamsForm",
})(AdvancedParamsFormBase)

export default AdvancedParamsForm
