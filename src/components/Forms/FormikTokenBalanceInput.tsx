import { FC } from "react"
import { useField } from "formik"
import TokenBalanceInput, { TokenBalanceInputProps } from "../TokenBalanceInput"

export type FormikTokenBalanceInput = {
  name: string
} & Omit<TokenBalanceInputProps, "setAmount">

export const FormikTokenBalanceInput: FC<FormikTokenBalanceInput> = ({
  name,
  ...restProps
}) => {
  const [field, meta, helpers] = useField(name)

  return (
    <TokenBalanceInput
      {...restProps}
      {...field}
      amount={meta.value}
      setAmount={helpers.setValue}
      hasError={Boolean(meta.touched && meta.error)}
      errorMsgText={meta.error}
    />
  )
}
