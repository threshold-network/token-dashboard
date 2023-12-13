import { FC } from "react"
import { BodySm, Box, Button } from "@threshold-network/components"
import { Form, FormikTokenBalanceInput } from "../../components/Forms"
import { InlineTokenBalance } from "../../components/TokenBalance"
import { tBTCFillBlack } from "../../static/icons/tBTCFillBlack"
import { FormikErrors, useFormikContext, withFormik } from "formik"
import { getErrorsObj, validateAmountInRange } from "../../utils/forms"
import { MINT_BITCOIN_MIN_AMOUNT } from "../../utils/tBTC"

/**
 * Formik for Ledger Live App where we can send bitcoins without leaving our
 * T dashboard. It should only be visible with `isEmbed` flag.
 */

type SendBitcoinsToDepositAddressFormBaseProps = {
  maxTokenAmount: string
}

const SendBitcoinsToDepositAddressFormBase: FC<
  SendBitcoinsToDepositAddressFormBaseProps
> = ({ maxTokenAmount }) => {
  const { isSubmitting } =
    useFormikContext<SendBitcoinsToDepositAddressFormValues>()

  return (
    <Form mt={10}>
      <FormikTokenBalanceInput
        name="amount"
        label={
          // TODO: Extract to a shared component - the same layout is used in
          // `UnmintFormBase` component.
          <>
            <Box as="span">Amount </Box>
            <BodySm as="span" float="right" color="gray.500">
              Balance:{" "}
              <InlineTokenBalance
                tokenAmount={maxTokenAmount}
                withSymbol
                tokenSymbol="BTC"
                tokenDecimals={8}
                precision={6}
                higherPrecision={8}
                withHigherPrecision
              />
            </BodySm>
          </>
        }
        placeholder="Amount of bitcoins you want to send to deposit address."
        max={maxTokenAmount}
        icon={tBTCFillBlack}
        tokenDecimals={8}
      />
      <Button
        size="lg"
        w="100%"
        mt={"10"}
        type="submit"
        isLoading={isSubmitting}
      >
        Send Bitcoins
      </Button>
    </Form>
  )
}

export type SendBitcoinsToDepositAddressFormValues = {
  amount: string
}

type SendBitcoinsToDepositAddressFormProps = {
  onSubmitForm: (values: SendBitcoinsToDepositAddressFormValues) => void
} & SendBitcoinsToDepositAddressFormBaseProps

export const SendBitcoinsToDepositAddressForm = withFormik<
  SendBitcoinsToDepositAddressFormProps,
  SendBitcoinsToDepositAddressFormValues
>({
  mapPropsToValues: () => ({
    amount: "",
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<SendBitcoinsToDepositAddressFormValues> = {}

    errors.amount = validateAmountInRange(
      values.amount,
      props.maxTokenAmount,
      MINT_BITCOIN_MIN_AMOUNT,
      undefined,
      8,
      8
    )

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "SendBitcoinsToDepositAddressForm",
  enableReinitialize: true,
})(SendBitcoinsToDepositAddressFormBase)
