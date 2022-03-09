import { FC } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react"
import { useField } from "formik"

export const FormikInput: FC<
  FormControlProps & { name: string; label: string; helperText: string }
> = ({ name, label, helperText, ...restProps }) => {
  const [field, meta] = useField(name)

  const isError = Boolean(meta.touched && meta.error)

  return (
    <FormControl isInvalid={isError} {...restProps}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        id={name}
        isInvalid={isError}
        errorBorderColor="red.300"
        {...field}
        value={meta.value}
      />
      {!isError ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{meta.error}</FormErrorMessage>
      )}
    </FormControl>
  )
}
