import { FC, useMemo } from "react"
import {
  Box,
  HStack,
  Stack,
  TextProps,
  useColorModeValue,
} from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"
import { useWeb3React } from "@web3-react/core"
import { BodyLg, BodySm, H3, H5 } from "@threshold-network/components"
import Icon from "./Icon"

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
  const { account, active } = useWeb3React()
  const shouldRenderTokenAmount = useMemo(
    () => tokenAmount && account && active,
    [tokenAmount, account, active]
  )

  const _tokenAmount = useMemo(() => {
    return numeral(formatUnits(tokenAmount, tokenDecimals)).format("0,0.00")
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
