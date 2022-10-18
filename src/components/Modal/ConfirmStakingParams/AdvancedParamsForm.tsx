import { FC, Ref } from "react"
import { FormikProps, FormikErrors, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"
import {
  Alert,
  AlertIcon,
  BodyXs,
  useColorModeValue,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { isAddress, isSameETHAddress } from "../../../web3/utils"
import Link from "../../Link"

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
  values,
}) => {
  const { authorizer } = values
  const { account } = useWeb3React()

  return (
    <Form id={formId}>
      <FormikInput
        name="stakingProvider"
        label="Provider Address"
        helperText={
          <AddressHelper text="This is your node address. You can setup this address on your own or receive it from your Staking Provider." />
        }
      />
      <FormikInput
        mt="6"
        name="beneficiary"
        label="Beneficiary Address"
        helperText={<AddressHelper text="This address will receive rewards." />}
      />
      <FormikInput
        mt="6"
        name="authorizer"
        label="Authorizer Address"
        helperText={
          <AddressHelper text="This address will authorize applications. We recommend you to use the same address as your wallet address." />
        }
      />
      {isAddress(authorizer) &&
        !isSameETHAddress(authorizer, account as string) && (
          <Alert status="warning" mt={6}>
            <AlertIcon />
            <BodyXs>
              Authorizer address is different than your wallet address. We
              recommend you to use the same address as your wallet address.
            </BodyXs>
          </Alert>
        )}
    </Form>
  )
}

const AddressHelper: FC<{ text: string }> = ({ text }) => {
  const textColor = useColorModeValue("gray.500", "gray.300")

  return (
    <BodyXs color={textColor}>
      {text} <Link to="/staking/how-it-works/overview">Learn more</Link>.
    </BodyXs>
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
