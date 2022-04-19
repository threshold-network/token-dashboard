import { FC } from "react"
import { Icon, Box } from "@chakra-ui/react"
import { withFormik, FormikProps, FormikErrors } from "formik"
import ThresholdCircleBrand from "../../static/icons/ThresholdCircleBrand"
import { FormikTokenBalanceInput } from "./FormikTokenBalanceInput"
import SubmitTxButton from "../SubmitTxButton"
import { Form } from "./Form"
import { getErrorsObj, validateAmountInRange } from "../../utils/forms"
import { formatTokenAmount } from "../../utils/formatAmount"

type FormValues = {
  tokenAmount: string
}

type SimpleTokenAmountFormProps = {
  onSubmitForm: (tokenAmount: string) => void
  submitButtonText: string
  maxTokenAmount: string | number
  initialTokenAmount?: string
  label?: string
  helperText?: string
  icon?: typeof Icon
  isDisabled?: boolean
  shouldDisplayMaxAmountInLabel?: boolean
}

const SimpleTokenAmountFormBase: FC<
  SimpleTokenAmountFormProps & FormikProps<FormValues>
> = ({
  submitButtonText,
  maxTokenAmount,
  helperText,
  label = "Stake Amount",
  icon = ThresholdCircleBrand,
  isDisabled = false,
  shouldDisplayMaxAmountInLabel = false,
  ...formikProps
}) => {
  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <FormikTokenBalanceInput
        name="tokenAmount"
        label={
          shouldDisplayMaxAmountInLabel ? (
            <>
              <Box as="span">{label} </Box>
              <Box as="span" float="right">
                {maxTokenAmount ? formatTokenAmount(maxTokenAmount) : "--"} T
              </Box>
            </>
          ) : (
            label
          )
        }
        placeholder="T amount"
        icon={icon}
        mb={2}
        max={maxTokenAmount}
        helperText={helperText}
        isDisabled={isDisabled}
        _disabled={{ bg: "gray.50", border: "none" }}
      />
      <SubmitTxButton
        type="submit"
        w="100%"
        mt="6"
        submitText={submitButtonText}
      />
    </Form>
  )
}

export const SimpleTokenAmountForm = withFormik<
  SimpleTokenAmountFormProps,
  FormValues
>({
  mapPropsToValues: (props) => ({
    tokenAmount: props.initialTokenAmount || "",
  }),
  validate: (values, props) => {
    const errors: FormikErrors<FormValues> = {}

    errors.tokenAmount = validateAmountInRange(
      values.tokenAmount,
      props.maxTokenAmount.toString()
    )
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values.tokenAmount)
  },
  displayName: "SimpleTokenAmountForm",
})(SimpleTokenAmountFormBase)
