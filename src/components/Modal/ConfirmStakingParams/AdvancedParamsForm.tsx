import { FC, Ref } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"

export interface FormValues {
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
  innerRef: Ref<FormikProps<FormValues>>
  checkIfProviderUsed: (
    stakingProvider: string
  ) => Promise<{ isProviderUsedForKeep: boolean; isProviderUsedForT: boolean }>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const AdvancedParamsForm = withFormik<AdvancedParamsFormProps, FormValues>({
  mapPropsToValues: ({ initialAddress }) => ({
    authorizer: initialAddress,
    beneficiary: initialAddress,
    stakingProvider: initialAddress,
  }),
  validate: async (values, props) => {
    const { checkIfProviderUsed } = props
    const errors: FormikErrors<FormValues> = {}

    errors.stakingProvider = validateETHAddress(values.stakingProvider)
    if (!errors.stakingProvider) {
      let validationMsg: string | undefined = ""
      try {
        const { isProviderUsedForKeep, isProviderUsedForT } =
          await checkIfProviderUsed(values.stakingProvider)
        validationMsg =
          isProviderUsedForKeep || isProviderUsedForT
            ? "Provider address is already in use."
            : undefined
      } catch (error) {
        console.error("`AdvancedParamsForm` validation error.", error)
        validationMsg = (error as Error)?.message
      }
      errors.stakingProvider = validationMsg
    }
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
