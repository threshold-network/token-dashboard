import { FC, useRef } from "react"
import {
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react"
import { createIcon } from "@chakra-ui/icons"
import { formatUnits, parseUnits } from "@ethersproject/units"
import NumberInput, { NumberInputValues } from "../NumberInput"

export interface TokenBalanceInputProps extends InputProps {
  icon: ReturnType<typeof createIcon>
  max: number | string
  amount?: string | number
  setAmount: (val?: string | number) => void
  label?: string
  hasError?: boolean
  errorMsgText?: string
}

const TokenBalanceInput: FC<TokenBalanceInputProps> = ({
  icon,
  max,
  amount,
  setAmount,
  label,
  errorMsgText,
  hasError = false,
  ...inputProps
}) => {
  const valueRef = useRef<string>(amount as string)

  const setToMax = () => {
    _setAmount(formatUnits(max))
    setAmount(valueRef.current)
  }

  const _setAmount = (value: string | number) => {
    valueRef.current = parseUnits(value ? value.toString() : "0").toString()
  }

  return (
    <FormControl isInvalid={hasError}>
      {label && <FormLabel htmlFor={inputProps.name}>{label}</FormLabel>}
      <InputGroup size="md">
        <InputLeftElement>
          <Icon boxSize="20px" as={icon} />
        </InputLeftElement>
        <NumberInput
          placeholder="Enter an amount"
          paddingLeft="2.5rem"
          paddingRight="4.5rem"
          {...inputProps}
          onValueChange={(values: NumberInputValues) =>
            _setAmount(values.value)
          }
          value={amount ? formatUnits(amount) : undefined}
          onChange={() => {
            setAmount(valueRef.current)
          }}
          id={inputProps.name}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={setToMax}>
            MAX
          </Button>
        </InputRightElement>
      </InputGroup>
      {hasError && <FormErrorMessage>{errorMsgText}</FormErrorMessage>}
    </FormControl>
  )
}

export default TokenBalanceInput
