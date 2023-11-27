import { ComponentType, FC, useMemo } from "react"
import {
  BodyLg,
  BodySm,
  H3,
  H5,
  Box,
  HStack,
  TextProps,
  useColorModeValue,
  Tooltip,
  BoxProps,
  Icon,
} from "@threshold-network/components"
import { formatTokenAmount } from "../utils/formatAmount"
import tokenIconMap, { TokenIcon } from "../static/icons/tokenIconMap"
import { useIsActive } from "../hooks/useIsActive"

export interface TokenBalanceProps {
  tokenAmount: string | number
  usdBalance?: string
  tokenSymbol?: string
  withUSDBalance?: boolean
  withSymbol?: boolean
  tokenDecimals?: number
  icon?: TokenIcon | ComponentType
  iconSize?: string
  isLarge?: boolean
  tokenFormat?: string
  withHigherPrecision?: boolean
  precision?: number
  higherPrecision?: number
  displayTildeBelow?: number
  isEstimated?: boolean
}

export const InlineTokenBalance: FC<TokenBalanceProps & BoxProps> = ({
  withSymbol,
  tokenDecimals,
  tokenFormat,
  tokenAmount,
  tokenSymbol,
  precision = 2,
  higherPrecision = 6,
  withHigherPrecision,
  displayTildeBelow = 1,
  isEstimated = false,
  ...restProps
}) => {
  const _tokenAmount = useMemo(() => {
    return formatTokenAmount(
      tokenAmount || 0,
      tokenFormat,
      tokenDecimals,
      precision,
      isEstimated ? 0 : displayTildeBelow
    )
  }, [tokenAmount, tokenFormat, tokenDecimals, precision])

  const _tokenAmountWithHigherPrecision = useMemo(() => {
    return formatTokenAmount(
      tokenAmount || 0,
      tokenFormat,
      tokenDecimals,
      higherPrecision,
      isEstimated ? 0 : 1
    )
  }, [tokenAmount, tokenFormat, tokenDecimals, higherPrecision])

  return (
    <Tooltip
      label={`${isEstimated ? "~" : ""}${_tokenAmountWithHigherPrecision}`}
      placement="top"
    >
      <Box as="span" {...restProps}>{`${isEstimated ? "~" : ""}${_tokenAmount}${
        withSymbol ? ` ${tokenSymbol}` : ""
      }`}</Box>
    </Tooltip>
  )
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
  tokenFormat,
  precision,
  higherPrecision,
  withHigherPrecision = false,
  ...restProps
}) => {
  const { isActive } = useIsActive()
  const shouldRenderTokenAmount = isActive

  const _tokenAmount = useMemo(() => {
    return formatTokenAmount(tokenAmount || 0, tokenFormat, tokenDecimals)
  }, [tokenAmount, tokenFormat, tokenDecimals])

  const BalanceTag = isLarge ? H3 : H5
  const SymbolTag = isLarge ? BodyLg : BodySm
  const usdBalanceColor = useColorModeValue("gray.500", "gray.300")

  // TODO: more flexible approach to style wrapper, token balance and USD balance.
  return (
    <Box>
      <HStack alignItems="center">
        {icon && (
          <Icon
            as={tokenIconMap[icon as TokenIcon] ?? icon}
            boxSize={iconSize}
          />
        )}{" "}
        <BalanceTag {...restProps}>
          {shouldRenderTokenAmount ? (
            withHigherPrecision ? (
              <InlineTokenBalance
                tokenAmount={tokenAmount}
                tokenFormat={tokenFormat}
                tokenDecimals={tokenDecimals}
                precision={precision}
                withHigherPrecision
              />
            ) : (
              _tokenAmount
            )
          ) : (
            "--"
          )}
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
