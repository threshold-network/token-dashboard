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
import { createIcon } from "@chakra-ui/icons"
import { formatUnits, parseUnits } from "@ethersproject/units"
import {
  BodySm,
  NumberFormatInput,
  NumberFormatInputValues,
  NumberFormatInputProps,
} from "@threshold-network/components"

export interface TokenBalanceInputProps
  extends InputProps,
    Omit<NumberFormatInputProps, "onValueChange"> {
  icon: ReturnType<typeof createIcon>
  max: number | string
  amount?: string | number
  setAmount: (val?: string | number) => void
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
    _setAmount(formatUnits(max))
  }

  const _setAmount = (value: string | number) => {
    setAmount(parseUnits(value ? value.toString() : "0").toString())
  }

  return (
    <Box>
      {label && (
        <BodySm mb={2} fontWeight="bold">
          {label}
        </BodySm>
      )}
      <InputGroup size="md">
        <InputLeftElement>
          <Icon boxSize="20px" as={icon} />
        </InputLeftElement>
        <NumberFormatInput
          placeholder="Enter an amount"
          paddingLeft="2.5rem"
          paddingRight="4.5rem"
          value={amount ? formatUnits(amount) : undefined}
          onValueChange={(values: NumberFormatInputValues) =>
            _setAmount(values.value)
          }
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
