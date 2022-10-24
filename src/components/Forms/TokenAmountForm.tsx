import { FC, Ref } from "react"
import { Icon, Box, ButtonProps, BodySm } from "@threshold-network/components"
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

export type TokenAmountFormBaseProps = {
  submitButtonText: string
  maxTokenAmount: string | number
  label?: string | JSX.Element
  helperText?: string
  icon?: typeof Icon
  isDisabled?: boolean
  shouldValidateForm?: boolean
  shouldDisplayMaxAmountInLabel?: boolean
  token?: { decimals: number; symbol: string }
  placeholder?: string
  minTokenAmount?: string | number
  submitButtonVariant?: ButtonProps["variant"]
}

export const TokenAmountFormBase: FC<
  TokenAmountFormBaseProps & FormikProps<FormValues>
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
  submitButtonVariant = "solid",
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
              <BodySm as="span" float="right" color="gray.500">
                {maxTokenAmount
                  ? formatTokenAmount(maxTokenAmount, undefined, token.decimals)
                  : "--"}{" "}
                {token.symbol}
              </BodySm>
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
        variant={submitButtonVariant}
        isDisabled={isDisabled}
      />
    </Form>
  )
}

export type TokenAmountFormProps = {
  innerRef?: Ref<FormikProps<FormValues>>
  onSubmitForm: (tokenAmount: string) => void
  initialTokenAmount?: string
} & TokenAmountFormBaseProps

export const TokenAmountForm = withFormik<TokenAmountFormProps, FormValues>({
  mapPropsToValues: (props) => ({
    tokenAmount: props.initialTokenAmount || "",
  }),
  validate: (values, props) => {
    if (!props.shouldValidateForm) return {}
    const errors: FormikErrors<FormValues> = {}

    errors.tokenAmount = validateAmountInRange(
      values.tokenAmount,
      props.maxTokenAmount.toString(),
      props.minTokenAmount ? props.minTokenAmount.toString() : DEFAULT_MIN_VALUE
    )
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values.tokenAmount)
  },
  displayName: "TokenAmountForm",
})(TokenAmountFormBase)

TokenAmountForm.defaultProps = {
  shouldValidateForm: true,
  minTokenAmount: DEFAULT_MIN_VALUE,
}
