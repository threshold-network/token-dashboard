import { FC } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { useField } from "formik"
import TooltipIcon from "../TooltipIcon"
import { Body3 } from "../Typography"

export const FormikInput: FC<
  FormControlProps & {
    name: string
    label: string
    secondaryLabel?: string
    helperText?: string
    placeholder?: string
    tooltip?: string
  }
> = ({
  name,
  label,
  secondaryLabel,
  helperText,
  placeholder,
  tooltip,
  ...restProps
}) => {
  const [field, meta] = useField(name)

  const isError = Boolean(meta.touched && meta.error)

  const secondaryLabelColor = useColorModeValue("gray.700", "white")

  return (
    <FormControl isInvalid={isError} {...restProps}>
      <Stack
        direction="row"
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center">
          <FormLabel m={0} htmlFor={name}>
            {label}
          </FormLabel>
          {tooltip && <TooltipIcon label={tooltip} />}
        </Stack>
        {secondaryLabel && (
          <Body3 color={secondaryLabelColor} m={0}>
            {secondaryLabel}
          </Body3>
        )}
      </Stack>
      <Input
        id={name}
        isInvalid={isError}
        errorBorderColor="red.300"
        placeholder={placeholder}
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
