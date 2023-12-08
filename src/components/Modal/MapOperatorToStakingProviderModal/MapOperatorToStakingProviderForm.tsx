import { FC, Ref } from "react"
import { FormikProps, FormikErrors, Formik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { getErrorsObj, validateETHAddress } from "../../../utils/forms"
import { isAddressZero, isSameETHAddress } from "../../../web3/utils"

export type MapOperatorToStakingProviderFormValues = {
  operator: string
  appName: string
  mappedOperatorTbtc?: string
  mappedOperatorRandomBeacon?: string
  mappedOperatorTaco?: string
  innerRef?: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
}

type ComponentProps = {
  formId: string
}

const MapOperatorToStakingProviderFormBase: FC<
  ComponentProps & FormikProps<MapOperatorToStakingProviderFormValues>
> = ({ formId, values }) => {
  return (
    <Form id={formId}>
      <FormikInput
        name="operator"
        label="Operator Address"
        helperText="The address generated during client setup and used by the client software."
      />
    </Form>
  )
}

const validateInputtedOperatorAddress = async (
  operator: string,
  appName: string,
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string,
    appName: string
  ) => Promise<boolean>,
  mappedOperatorTbtc?: string,
  mappedOperatorRandomBeacon?: string
): Promise<string | undefined> => {
  let validationMsg: string | undefined = ""
  mappedOperatorTbtc = mappedOperatorTbtc || ""
  mappedOperatorRandomBeacon = mappedOperatorRandomBeacon || ""

  try {
    const isOperatorMappedToAnotherStakingProvider =
      await checkIfOperatorIsMappedToAnotherStakingProvider(operator, appName)
    validationMsg = undefined
    if (isOperatorMappedToAnotherStakingProvider) {
      validationMsg = "Operator is already mapped to another staking provider."
    }

    const isOperatorMappedOnlyInTbtc =
      !isAddressZero(mappedOperatorTbtc) &&
      isAddressZero(mappedOperatorRandomBeacon)

    const isOperatorMappedOnlyInRandomBeacon =
      isAddressZero(mappedOperatorTbtc) &&
      !isAddressZero(mappedOperatorRandomBeacon)

    if (
      isOperatorMappedOnlyInRandomBeacon &&
      !isSameETHAddress(operator, mappedOperatorRandomBeacon)
    ) {
      validationMsg =
        "The operator address doesn't match the one used in random beacon app"
    }
    if (
      isOperatorMappedOnlyInTbtc &&
      !isSameETHAddress(operator, mappedOperatorTbtc)
    ) {
      validationMsg =
        "The operator address doesn't match the one used in tbtc app"
    }
  } catch (error) {
    console.error("`MapOperatorToStakingProviderForm` validation error.", error)
    validationMsg = (error as Error)?.message
  }

  return validationMsg
}

type MapOperatorToStakingProviderFormProps = {
  appName: string
  mappedOperatorTbtc?: string
  mappedOperatorRandomBeacon?: string
  mappedOperatorTaco?: string
  innerRef?: Ref<FormikProps<MapOperatorToStakingProviderFormValues>>
  checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string,
    appName: string
  ) => Promise<boolean>
} & ComponentProps

const MapOperatorToStakingProviderForm: FC<
  MapOperatorToStakingProviderFormProps
> = (props) => {
  const {
    appName,
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    mappedOperatorTaco,
    checkIfOperatorIsMappedToAnotherStakingProvider,
  } = props

  return (
    <Formik<MapOperatorToStakingProviderFormValues>
      onSubmit={() => {}}
      initialValues={{ operator: "", appName: appName }}
      validate={async (values) => {
        const errors: FormikErrors<MapOperatorToStakingProviderFormValues> = {}

        errors.operator = validateETHAddress(values.operator)
        if (!errors.operator) {
          errors.operator = await validateInputtedOperatorAddress(
            values.operator,
            appName,
            checkIfOperatorIsMappedToAnotherStakingProvider,
            mappedOperatorTbtc,
            mappedOperatorRandomBeacon
          )
        }
        return getErrorsObj(errors)
      }}
    >
      {(formikProps) => (
        <MapOperatorToStakingProviderFormBase {...props} {...formikProps} />
      )}
    </Formik>
  )
}

export default MapOperatorToStakingProviderForm
