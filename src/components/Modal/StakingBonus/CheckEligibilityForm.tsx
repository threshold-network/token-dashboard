import { FC } from "react"
import { Button } from "@chakra-ui/react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"

export interface FormValues {
  stakingProvider: string
}

const CheckEligibilityFormBase: FC<FormikProps<FormValues>> = (formikProps) => {
  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <FormikInput
        helperText=""
        name="stakingProvider"
        label="Provider Address"
        placeholder="Paste your Provider address here"
      />
      <Button mt="6" type="submit" isFullWidth>
        Check eligibility
      </Button>
    </Form>
  )
}

type CheckEligibilityFormProps = {
  onSubmitForm: (values: FormValues) => void
}

export const CheckEligibilityForm = withFormik<
  CheckEligibilityFormProps,
  FormValues
>({
  mapPropsToValues: () => ({
    stakingProvider: "",
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<FormValues> = {}

    errors.stakingProvider = validateETHAddress(values.stakingProvider)

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "CheckBonusEligibilityForm",
})(CheckEligibilityFormBase)
