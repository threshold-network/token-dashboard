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
  BodySm,
} from "@threshold-network/components"
import { useField } from "formik"
import TooltipIcon from "../TooltipIcon"

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
          // @ts-ignore - htmlFor is not a valid prop for BodySm but we're setting to label here
          <BodySm as="label" htmlFor={name} color={secondaryLabelColor} m={0}>
            {secondaryLabel}
          </BodySm>
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
