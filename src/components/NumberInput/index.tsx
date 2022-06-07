import ReactNumberFormat from "react-number-format"
import { chakra, InputProps, useMultiStyleConfig } from "@chakra-ui/react"
import { FC, forwardRef } from "react"

const ChakraWrapper = chakra(ReactNumberFormat)

export interface NumberInputValues {
  formattedValue: string
  value: string
  floatValue: number
}

export type NumberInputProps = InputProps & {
  onValueChange: (values: NumberInputValues) => void
  decimalScale?: number
}

const NumberInput: FC<NumberInputProps> = forwardRef<
  HTMLInputElement,
  NumberInputProps
>((props, ref) => {
  const { field: css } = useMultiStyleConfig("Input", props)

  const { decimalScale, isDisabled, ...restProps } = props

  return (
    // @ts-ignore
    <ChakraWrapper
      allowLeadingZeros={false}
      thousandSeparator
      decimalScale={decimalScale}
      __css={css}
      disabled={isDisabled}
      getInputRef={ref}
      {...restProps}
    />
  )
})

export default NumberInput
