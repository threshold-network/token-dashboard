import { FC, useMemo } from "react"
import {
  BodyLg,
  BodySm,
  H3,
  H5,
  Box,
  HStack,
  Stack,
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
    return formatTokenAmount(tokenAmount)
  }, [tokenAmount])

  // TODO: more flexible approach to style wrapper, token balance and USD balance.
  return (
    <HStack>
      {icon && <Icon as={icon} boxSize={iconSize} alignSelf="center" />}
      <Box>
        <Stack direction="row">
          {isLarge ? (
            <H3 {...restProps}>
              {shouldRenderTokenAmount ? _tokenAmount : "--"}
            </H3>
          ) : (
            <H5 {...restProps}>
              {shouldRenderTokenAmount ? _tokenAmount : "--"}
            </H5>
          )}
          {withSymbol &&
            tokenSymbol &&
            (isLarge ? (
              <BodyLg alignSelf="flex-end">{tokenSymbol}</BodyLg>
            ) : (
              <BodySm alignSelf="flex-end">{tokenSymbol}</BodySm>
            ))}
        </Stack>
        {withUSDBalance && usdBalance && shouldRenderTokenAmount && (
          <BodySm color={useColorModeValue("gray.500", "gray.300")}>
            {usdBalance}
          </BodySm>
        )}
      </Box>
    </HStack>
  )
}

export default TokenBalance
