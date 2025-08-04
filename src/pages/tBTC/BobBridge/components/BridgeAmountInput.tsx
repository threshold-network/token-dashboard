import { FC } from "react"
import {
  Box,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BodySm } from "@threshold-network/components"
import { useTokenBalance } from "../../../../hooks/useTokenBalance"
import { Token } from "../../../../enums"
import { formatTokenAmount } from "../../../../utils/formatAmount"
import { useToken } from "../../../../hooks/useToken"
import { parseUnits, formatUnits } from "@ethersproject/units"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"

interface BridgeAmountInputProps {
  amount: string
  onChange: (amount: string) => void
  tokenSymbol: string
}

const BridgeAmountInput: FC<BridgeAmountInputProps> = ({
  amount,
  onChange,
  tokenSymbol,
}) => {
  const inputBg = useColorModeValue("gray.50", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")

  const balance = useTokenBalance(Token.TBTCV2)
  const token = useToken(Token.TBTCV2)

  const formattedBalance = formatTokenAmount(balance, undefined, 18, 6)

  // Calculate USD value
  const usdValue = (() => {
    try {
      if (!amount || amount === "0") return "0.00"
      const parsedAmount = parseFloat(amount)
      if (isNaN(parsedAmount)) return "0.00"
      const usdConversion = token.usdConversion || 0
      const usdAmount = parsedAmount * usdConversion
      return usdAmount.toFixed(2)
    } catch {
      return "0.00"
    }
  })()

  const handleMaxClick = () => {
    // Convert balance to string with proper decimals
    try {
      const balanceStr = formatUnits(balance, 18)
      onChange(balanceStr)
    } catch (error) {
      console.error("Error formatting balance:", error)
      onChange("0")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange(value)
    }
  }

  return (
    <Box
      bg={inputBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
    >
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={2} flex={1}>
          <BodySm color="gray.500" fontWeight="medium">
            Amount
          </BodySm>
          <InputGroup size="lg">
            <Input
              value={amount}
              onChange={handleInputChange}
              placeholder="0.00"
              variant="unstyled"
              fontSize="2xl"
              fontWeight="bold"
              pr={2}
            />
          </InputGroup>
          <Text fontSize="sm" color="gray.500">
            ${usdValue}
          </Text>
        </VStack>
        <VStack align="end" spacing={4} pt={9}>
          <HStack spacing={2}>
            <Icon as={tBTCFillBlack} boxSize={6} />
            <Text fontWeight="bold">{tokenSymbol}</Text>
          </HStack>
          <Text
            fontSize="sm"
            color="gray.500"
            cursor="pointer"
            onClick={handleMaxClick}
            _hover={{ color: "brand.500", textDecoration: "underline" }}
          >
            Balance: {formattedBalance}
          </Text>
        </VStack>
      </Flex>
    </Box>
  )
}

export default BridgeAmountInput
