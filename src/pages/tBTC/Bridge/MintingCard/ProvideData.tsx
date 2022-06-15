import { FC, Ref, useRef } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Button, Stack } from "@chakra-ui/react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "./TbtcMintingCardSubtitle"
import { Body2 } from "../../../../components/Typography"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"

export interface FormValues {
  ethAddress: string
  btcRecoveryAddress: string
}

type ComponentProps = {
  formId: string
}

const MintingProcessFormBase: FC<ComponentProps & FormikProps<FormValues>> = ({
  formId,
}) => {
  return (
    <Form id={formId}>
      <FormikInput
        name="ethAddress"
        label="ETH address"
        // helperText="Address where you’ll receive your tBTC"
      />
      <FormikInput name="btcRecoveryAddress" label="BTC Recovery Address" />
    </Form>
  )
}

type MintingProcessFormProps = {
  initialAddress: string
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({ initialAddress }) => ({
    ethAddress: initialAddress,
    btcRecoveryAddress: "",
  }),
  validate: async (values) => {
    const errors: FormikErrors<FormValues> = {}
    errors.ethAddress = validateETHAddress(values.ethAddress)
    errors.btcRecoveryAddress = validateBTCAddress(values.btcRecoveryAddress)
    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "MintingProcessForm",
})(MintingProcessFormBase)

export const ProvideData: FC = () => {
  const {} = useTbtcState()
  const formRef = useRef<FormikProps<FormValues>>(null)
  const onSubmit = (values: any) => {
    console.log("values", values)
  }

  return (
    <Stack spacing={8}>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle stepText="Step 1" subTitle="Provide Data" />
      <Body2 color="gray.500">
        Based on these two addresses, the system will generate for you an unique
        BTC deposit address. There is no minting limit
      </Body2>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialAddress="ABC"
        onSubmitForm={onSubmit}
      />
      <Button type="submit" form="tbtc-minting-data-form">
        Generate Deposit Address
      </Button>
    </Stack>
  )
}
