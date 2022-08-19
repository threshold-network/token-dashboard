import { FC, Ref } from "react"
import { Icon, Box } from "@chakra-ui/react"
import { withFormik, FormikProps, FormikErrors } from "formik"
import ThresholdCircleBrand from "../../static/icons/ThresholdCircleBrand"
import { FormikTokenBalanceInput } from "./FormikTokenBalanceInput"
import SubmitTxButton from "../SubmitTxButton"
import { Form } from "./Form"
import {
  DEFAULT_MIN_VALUE,
  getErrorsObj,
  validateAmountInRange,
} from "../../utils/forms"
import { formatTokenAmount } from "../../utils/formatAmount"

export type FormValues = {
  tokenAmount: string
}

type TokenAmountFormProps = {
  onSubmitForm: (tokenAmount: string) => void
  submitButtonText: string
  maxTokenAmount: string | number
  initialTokenAmount?: string
  label?: string
  helperText?: string
  icon?: typeof Icon
  isDisabled?: boolean
  shouldValidateForm?: boolean
  shouldDisplayMaxAmountInLabel?: boolean
  token?: { decimals: number; symbol: string }
  innerRef?: Ref<FormikProps<FormValues>>
  placeholder?: string
  minTokenAmount?: string | number
}

const TokenAmountFormBase: FC<
  TokenAmountFormProps & FormikProps<FormValues>
> = ({
  submitButtonText,
  maxTokenAmount,
  helperText,
  label = "Token Amount",
  token = { decimals: 18, symbol: "T" },
  icon = ThresholdCircleBrand,
  isDisabled = false,
  shouldValidateForm = true,
  shouldDisplayMaxAmountInLabel = false,
  placeholder,
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
                {maxTokenAmount
                  ? formatTokenAmount(maxTokenAmount, undefined, token.decimals)
                  : "--"}{" "}
                {token.symbol}
              </Box>
            </>
          ) : (
            label
          )
        }
        placeholder={placeholder || `${token.symbol} amount`}
        icon={icon}
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

export const TokenAmountForm = withFormik<TokenAmountFormProps, FormValues>({
  mapPropsToValues: (props) => ({
    tokenAmount: props.initialTokenAmount || "",
  }),
  // validate: (values, props) => {
  //   if (!props.shouldValidateForm) return {}
  //   const errors: FormikErrors<FormValues> = {}
  //
  //   errors.tokenAmount = validateAmountInRange(
  //     values.tokenAmount,
  //     props.maxTokenAmount.toString(),
  //     props.minTokenAmount ? props.minTokenAmount.toString() : DEFAULT_MIN_VALUE
  //   )
  //   return getErrorsObj(errors)
  // },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values.tokenAmount)
  },
  displayName: "TokenAmountForm",
})(TokenAmountFormBase)

TokenAmountForm.defaultProps = {
  shouldValidateForm: true,
  minTokenAmount: DEFAULT_MIN_VALUE,
}
