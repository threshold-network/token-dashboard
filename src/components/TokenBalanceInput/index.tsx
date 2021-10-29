import { FC, ReactElement, useState } from "react"
import {
  InputGroup,
  Input,
  InputLeftElement,
  InputRightElement,
  Button,
  InputProps,
  Icon,
} from "@chakra-ui/react"

const TokenBalanceInput: FC<InputProps & { icon?: any; max: number }> = ({
  icon,
  max,
  ...inputProps
}) => {
  const [amount, setAmount] = useState(0)

  const setToMax = () => {
    setAmount(max)
  }

  return (
    <InputGroup size="md">
      {icon && (
        <InputLeftElement width="4.5rem">
          <Icon h="16px" w="16px" as={icon} />
        </InputLeftElement>
      )}
      <Input
        pr="4.5rem"
        value={amount}
        type={inputProps.type || "number"}
        onChange={(e) => e.target.value}
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
