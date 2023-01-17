import { FC, useEffect, useRef } from "react"
import {
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  FormControl,
  FormLabel,
  useColorModeValue,
  NumberFormatInput,
  NumberFormatInputValues,
  NumberFormatInputProps,
} from "@threshold-network/components"
import { createIcon } from "@chakra-ui/icons"
import { formatUnits, parseUnits } from "@ethersproject/units"
import { Zero } from "@ethersproject/constants"
import { BigNumber } from "@ethersproject/bignumber"
import { web3 as web3Constants } from "../../constants"
import HelperErrorText from "../Forms/HelperErrorText"

export interface TokenBalanceInputProps
  extends InputProps,
    Omit<NumberFormatInputProps, "onValueChange"> {
  icon: ReturnType<typeof createIcon>
  max: number | string
  amount?: string | number
  setAmount: (val?: string | number) => void
  label?: string | JSX.Element
  hasError?: boolean
  errorMsgText?: string | JSX.Element
  helperText?: string | JSX.Element
}

const TokenBalanceInput: FC<TokenBalanceInputProps> = ({
  icon,
  max,
  amount,
  setAmount,
  label,
  errorMsgText,
  helperText,
  hasError = false,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>()
  const valueRef = useRef<string | number | undefined>(amount)
  const labelColor = useColorModeValue("gray.700", "gray.300")

  useEffect(() => {
    if (amount === "" && inputRef.current) {
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set
      setValue!.call(inputRef.current, "")
      const event = new Event("change", { bubbles: true })
      inputRef.current.dispatchEvent(event)
      valueRef.current = undefined
    }
  })

  const setToMax = () => {
    let remainder = Zero
    const { decimalScale } = inputProps
    if (
      decimalScale &&
      decimalScale > 0 &&
      decimalScale < web3Constants.STANDARD_ERC20_DECIMALS
    ) {
      remainder = BigNumber.from(max).mod(
        BigNumber.from(10).pow(
          web3Constants.STANDARD_ERC20_DECIMALS - decimalScale
        )
      )
    }
    _setAmount(formatUnits(BigNumber.from(max).sub(remainder)))
    setAmount(valueRef.current)
  }

  const _setAmount = (value: string | number) => {
    valueRef.current = value
      ? parseUnits(value.toString()).toString()
      : undefined
  }

  return (
    <FormControl isInvalid={hasError} isDisabled={inputProps.isDisabled}>
      {label && (
        <FormLabel htmlFor={inputProps.name} color={labelColor}>
          {label}
        </FormLabel>
      )}
      <InputGroup size="md">
        <InputLeftElement>
          <Icon boxSize="20px" as={icon} />
        </InputLeftElement>
        <NumberFormatInput
          // @ts-ignore
          ref={inputRef}
          placeholder="Enter an amount"
          paddingLeft="2.5rem"
          paddingRight="4.5rem"
          {...inputProps}
          onValueChange={(values: NumberFormatInputValues) =>
            _setAmount(values.value)
          }
          value={amount ? formatUnits(amount) : undefined}
          onChange={() => {
            setAmount(valueRef.current)
          }}
          id={inputProps.name}
        />
        {!inputProps.isDisabled && (
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={setToMax}>
              MAX
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
      <HelperErrorText
        helperText={helperText}
        errorMsgText={errorMsgText}
        hasError={hasError}
      />
    </FormControl>
  )
}

export default TokenBalanceInput
