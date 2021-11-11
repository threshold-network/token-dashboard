import ReactNumberFormat from "react-number-format"
import { chakra, InputProps, useMultiStyleConfig } from "@chakra-ui/react"
import { FC } from "react"

const ChakraWrapper = chakra(ReactNumberFormat)

export interface NumberInputValues {
  formattedValue: string
  value: string
  floatValue: number
}

const NumberInput: FC<
  InputProps & { onValueChange: (values: NumberInputValues) => void }
> = (props) => {
  const { field: css } = useMultiStyleConfig("Input", props)

  return (
    <ChakraWrapper
      allowLeadingZeros={false}
      thousandSeparator
      __css={css}
      {...props}
    />
  )
}

export default NumberInput
