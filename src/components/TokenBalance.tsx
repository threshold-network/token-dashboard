import { FC, useMemo } from "react"
import {
  BodyLg,
  BodySm,
  H3,
  H5,
  Box,
  HStack,
  TextProps,
  useColorModeValue,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import Icon from "./Icon"
import { formatTokenAmount } from "../utils/formatAmount"

interface TokenBalanceProps {
  tokenAmount: string | number
  usdBalance?: string
  tokenSymbol?: string
  withUSDBalance?: boolean
  withSymbol?: boolean
  tokenDecimals?: number
  icon?: any
  iconSize?: string
  isLarge?: boolean
}

const TokenBalance: FC<TokenBalanceProps & TextProps> = ({
  tokenAmount,
  usdBalance,
  tokenSymbol,
  withUSDBalance = false,
  withSymbol = false,
  tokenDecimals,
  icon,
  iconSize = "32px",
  isLarge,
  ...restProps
}) => {
  const { active } = useWeb3React()
  const shouldRenderTokenAmount = active

  const _tokenAmount = useMemo(() => {
    return formatTokenAmount(tokenAmount || 0)
  }, [tokenAmount])

  const BalanceTag = isLarge ? H3 : H5
  const SymbolTag = isLarge ? BodyLg : BodySm
  const usdBalanceColor = useColorModeValue("gray.500", "gray.300")

  // TODO: more flexible approach to style wrapper, token balance and USD balance.
  return (
    <Box>
      <HStack alignItems="center">
        {icon && <Icon as={icon} boxSize={iconSize} />}{" "}
        <BalanceTag {...restProps}>
          {shouldRenderTokenAmount ? _tokenAmount : "--"}
          {withSymbol && tokenSymbol && (
            <SymbolTag as="span"> {tokenSymbol}</SymbolTag>
          )}
        </BalanceTag>
      </HStack>
      {withUSDBalance && usdBalance && shouldRenderTokenAmount && (
        <BodySm mt="2" color={usdBalanceColor}>
          {usdBalance} USD
        </BodySm>
      )}
    </Box>
  )
}

export default TokenBalance
