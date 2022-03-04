import { FC } from "react"
import { Form, withFormik, FormikProps, FormikErrors } from "formik"
import { Button, Box } from "@chakra-ui/react"
import ThresholdCircleBrand from "../../static/icons/ThresholdCircleBrand"
import { FormikTokenBalanceInput } from "./FormikTokenBalanceInput"

type FormValues = {
  tokenAmount: string
}

type SimpleTokenAmountFormProps = {
  onSubmitForm: (value: string) => void
  submitButtonText: string
  maxTokenAmount: string | number
}

const SimpleTokenAmountFormBase: FC<
  SimpleTokenAmountFormProps & FormikProps<FormValues>
> = ({ submitButtonText, maxTokenAmount, ...formikProps }) => {
  return (
    <Box as={Form} mt="7" mb="8">
      <FormikTokenBalanceInput
        name="tokenAmount"
        label="Stake Amount"
        placeholder="T amount"
        icon={ThresholdCircleBrand}
        mb={2}
        max={maxTokenAmount}
      />
      <Button type="submit" w="100%" mt="6">
        {submitButtonText}
      </Button>
    </Box>
  )
}

export const SimpleTokenAmountForm = withFormik<
  SimpleTokenAmountFormProps,
  FormValues
>({
  mapPropsToValues: () => ({ tokenAmount: "" }),
  validate: (values) => {
    const errors: FormikErrors<FormValues> = {}

    // TODO add validation
    if (!values.tokenAmount) {
      errors.tokenAmount = "Required"
    }
    return errors
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values.tokenAmount)
  },
  displayName: "SimpleTokenAmountForm",
})(SimpleTokenAmountFormBase)
