import { FC } from "react"
import {
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react"
import NumberInput, { NumberInputValues } from "../NumberInput"

interface TokenBalanceInputProps {
  icon: any
  max: number
  amount: string | number
  setAmount: (val: string | number) => void
}

const TokenBalanceInput: FC<InputProps & TokenBalanceInputProps> = ({
  icon,
  max,
  amount,
  setAmount,
  ...inputProps
}) => {
  const setToMax = () => {
    setAmount(max)
  }

  return (
    <InputGroup size="md">
      <InputLeftElement>
        <Icon boxSize="20px" as={icon} />
      </InputLeftElement>
      <NumberInput
        paddingLeft="2.5rem"
        paddingRight="4.5rem"
        value={amount}
        onValueChange={(values: NumberInputValues) => setAmount(values.value)}
        {...inputProps}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={setToMax}>
          MAX
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

export default TokenBalanceInput
