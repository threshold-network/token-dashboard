import { ChangeEvent, FC, FocusEvent } from "react"
import {
  FormControl,
  FormControlProps,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  BodySm,
} from "@threshold-network/components"
import { useField } from "formik"
import TooltipIcon from "../TooltipIcon"
import HelperErrorText from "./HelperErrorText"

export const FormikInput: FC<
  FormControlProps & {
    name: string
    label: string
    secondaryLabel?: string
    helperText?: string | JSX.Element
    placeholder?: string
    tooltip?: string
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void
  }
> = ({
  name,
  label,
  secondaryLabel,
  helperText,
  placeholder,
  tooltip,
  onChange,
  onBlur,
  ...restProps
}) => {
  const [field, meta] = useField(name)

  const isError = Boolean(meta.touched && meta.error)

  const secondaryLabelColor = "gray.500"
  const labelColor = useColorModeValue("gray.700", "gray.300")

  return (
    <FormControl isInvalid={isError} {...restProps}>
      <Stack
        direction="row"
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center">
          <FormLabel m={0} htmlFor={name} color={labelColor}>
            {label}{" "}
            {tooltip && (
              <TooltipIcon
                // Unset color to get the same color as label.
                color="unset"
                label={tooltip}
                width="20px"
                height="20px"
                alignSelf="center"
                m="auto"
                verticalAlign="text-top"
              />
            )}
          </FormLabel>
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
        _placeholder={{ color: useColorModeValue("gray.400", "gray.500") }}
        name={field.name}
        value={field.value}
        onChange={(e) => {
          field.onChange(e)
          onChange?.(e)
        }}
        onBlur={(e) => {
          field.onBlur(e)
          onBlur?.(e)
        }}
      />
      <HelperErrorText
        helperText={helperText}
        errorMsgText={meta.error}
        hasError={isError}
      />
    </FormControl>
  )
}
