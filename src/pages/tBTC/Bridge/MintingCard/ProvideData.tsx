import { FC, Ref, useRef } from "react"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { Box, Button } from "@chakra-ui/react"
import { BodyMd } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "./TbtcMintingCardSubtitle"
import { Form, FormikInput } from "../../../../components/Forms"
import {
  getErrorsObj,
  validateBTCAddress,
  validateETHAddress,
} from "../../../../utils/forms"
import { MintingStep } from "../../../../types/tbtc"

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
    <Form id={formId} mb={6}>
      <FormikInput
        name="ethAddress"
        label="ETH address"
        tooltip="ETH address is prepopulated with your wallet address. This is the address where you’ll receive your tBTC."
        mb={6}
      />
      <FormikInput
        name="btcRecoveryAddress"
        label="BTC Recovery Address"
        tooltip="Recovery Address is a BTC address where your BTC funds are sent back if something exceptional happens with your deposit. The funds can be claimed."
      />
    </Form>
  )
}

type MintingProcessFormProps = {
  initialEthAddress: string
  innerRef: Ref<FormikProps<FormValues>>
  onSubmitForm: (values: FormValues) => void
} & ComponentProps

const MintingProcessForm = withFormik<MintingProcessFormProps, FormValues>({
  mapPropsToValues: ({ initialEthAddress }) => ({
    ethAddress: initialEthAddress,
    btcRecoveryAddress: "17VZNX1SN5NtKa8UQFxwQbFeFc3iqRYhem",
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
  const { updateState } = useTbtcState()
  const formRef = useRef<FormikProps<FormValues>>(null)
  const onSubmit = (values: FormValues) => {
    updateState("btcRecoveryAddress", values.btcRecoveryAddress)
    updateState("ethAddress", values.ethAddress)
    // TODO: Generate this address
    updateState(
      "btcDepositAddress",
      "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    )
    updateState("mintingStep", MintingStep.Deposit)
  }

  return (
    <Box>
      <TbtcMintingCardTitle />
      <TbtcMintingCardSubTitle stepText="Step 1" subTitle="Provide Data" />
      <BodyMd color="gray.500" mb={12}>
        Based on these two addresses, the system will generate for you an unique
        BTC deposit address. There is no minting limit
      </BodyMd>
      <MintingProcessForm
        innerRef={formRef}
        formId="tbtc-minting-data-form"
        initialEthAddress="0xdad30fd9D55Fe12E3435Fb32705242bc1b42a520"
        onSubmitForm={onSubmit}
      />
      <Button type="submit" form="tbtc-minting-data-form" isFullWidth>
        Generate Deposit Address
      </Button>
    </Box>
  )
}
