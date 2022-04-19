import ReactNumberFormat from "react-number-format"
import { chakra, InputProps, useMultiStyleConfig } from "@chakra-ui/react"
import { FC } from "react"

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

const NumberInput: FC<NumberInputProps> = (props) => {
  const { field: css } = useMultiStyleConfig("Input", props)

  return (
    // @ts-ignore
    <ChakraWrapper
      allowLeadingZeros={false}
      thousandSeparator
      decimalScale={props.decimalScale}
      __css={css}
      disabled={props.isDisabled}
      {...props}
    />
  )
}

export default NumberInput
