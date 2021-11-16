import { FC } from "react"
import {
  Box,
  Button,
  Icon,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react"
import NumberInput, { NumberInputValues } from "../NumberInput"
import { Body3 } from "../Typography"
import { createIcon } from "@chakra-ui/icons"

export interface TokenBalanceInputProps extends InputProps {
  icon: ReturnType<typeof createIcon>
  max: number
  amount: string | number
  setAmount: (val: string | number) => void
  label?: string
}

const TokenBalanceInput: FC<TokenBalanceInputProps> = ({
  icon,
  max,
  amount,
  setAmount,
  label,
  ...inputProps
}) => {
  const setToMax = () => {
    setAmount(max)
  }

  return (
    <Box>
      {label && (
        <Body3 mb={2} fontWeight="bold">
          {label}
        </Body3>
      )}
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
    </Box>
  )
}

export default TokenBalanceInput
