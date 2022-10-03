import { FC, Ref, useEffect, useState } from "react"
import { BigNumber } from "ethers"
import { FormikErrors, FormikProps, withFormik } from "formik"
import { BodyMd, BodySm } from "@threshold-network/components"
import {
  TokenAmountFormBase,
  TokenAmountFormBaseProps,
  FormValues,
} from "../Forms"
import {
  DEFAULT_MIN_VALUE,
  getErrorsObj,
  validateAmountInRange,
} from "../../utils/forms"
import { formatTokenAmount } from "../../utils/formatAmount"

type ComponentProps = {
  totalStake: string
  authorizedAmount: string
  isAuthorization?: boolean
} & Omit<TokenAmountFormBaseProps, "label" | "maxTokenAmount">

const Label: FC<{ label: string; remainigAmount: string }> = ({
  label,
  remainigAmount,
}) => {
  return (
    <>
      <BodyMd as="span" fontWeight="bold">
        {label}
      </BodyMd>
      <BodySm as="span" color="gray.500" float="right">
        Remaining Balance: {formatTokenAmount(remainigAmount)} T
      </BodySm>
    </>
  )
}

const StakingApplicationFormBase: FC<
  ComponentProps & FormikProps<FormValues>
> = ({
  totalStake,
  submitButtonText,
  isDisabled,
  helperText,
  authorizedAmount,
  isAuthorization = true,
  ...formikProps
}) => {
  const { values } = formikProps
  const { tokenAmount } = values
  const [remainigAmount, setRemainingAmount] = useState("0")
  const [maxAmount, setMaxAmount] = useState("0")

  useEffect(() => {
    if (!isAuthorization) {
      setMaxAmount(authorizedAmount)
    } else {
      setMaxAmount(BigNumber.from(totalStake).sub(authorizedAmount).toString())
    }
  }, [authorizedAmount, totalStake, isAuthorization])

  useEffect(() => {
    const _tokenAmount = BigNumber.from(tokenAmount || "0")
    const _max = BigNumber.from(maxAmount)
    setRemainingAmount(
      tokenAmount
        ? _tokenAmount.gte(_max)
          ? "0"
          : _max.sub(_tokenAmount).toString()
        : maxAmount
    )
  }, [tokenAmount, authorizedAmount, totalStake, maxAmount])

  return (
    <TokenAmountFormBase
      label={
        <Label
          label={isAuthorization ? "Increase Amount" : "Decrease Amount"}
          remainigAmount={remainigAmount}
        />
      }
      submitButtonText={submitButtonText}
      isDisabled={isDisabled}
      maxTokenAmount={totalStake}
      placeholder={"Enter amount"}
      helperText={helperText}
      {...formikProps}
    />
  )
}

type StakingAppFormBaseProps = {
  initialAmount?: string
  minimumAuthorizationAmount: string
  innerRef?: Ref<FormikProps<FormValues>>
  onSubmitForm: (tokenAmount: string) => void
} & ComponentProps

const authorizationValidation = (
  values: FormValues,
  props: StakingAppFormBaseProps
) => {
  const errors: FormikErrors<FormValues> = {}

  const { tokenAmount } = values
  const { authorizedAmount, totalStake, minimumAuthorizationAmount } = props

  const _authorizedAmount = BigNumber.from(authorizedAmount)
  const _max = BigNumber.from(totalStake).sub(_authorizedAmount)
  const _minimumAuthorizationAmount = BigNumber.from(minimumAuthorizationAmount)

  const min = _authorizedAmount.gt(_minimumAuthorizationAmount)
    ? DEFAULT_MIN_VALUE
    : _minimumAuthorizationAmount.sub(_authorizedAmount)

  errors.tokenAmount = validateAmountInRange(
    tokenAmount,
    _max.toString(),
    min.toString()
  )

  return getErrorsObj(errors)
}

const deauthorizationValidation = (
  values: FormValues,
  props: StakingAppFormBaseProps
) => {
  const errors: FormikErrors<FormValues> = {}

  const { tokenAmount } = values
  const { authorizedAmount, minimumAuthorizationAmount } = props
  const max = BigNumber.from(authorizedAmount).sub(minimumAuthorizationAmount)
  const _tokenAmount = BigNumber.from(tokenAmount)

  if (!_tokenAmount.eq(authorizedAmount)) {
    errors.tokenAmount = validateAmountInRange(
      tokenAmount,
      max.toString(),
      DEFAULT_MIN_VALUE
    )
  }

  return getErrorsObj(errors)
}

export const StakingAppForm = withFormik<StakingAppFormBaseProps, FormValues>({
  mapPropsToValues: ({ initialAmount }) => ({
    tokenAmount: initialAmount || "0",
  }),
  validate: (values, props) => {
    const validationFn = props.isAuthorization
      ? authorizationValidation
      : deauthorizationValidation

    return validationFn(values, props)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values.tokenAmount)
  },
  displayName: "StakingAppForm",
})(StakingApplicationFormBase)
