import { FC, useMemo } from "react"
import { Box, Stack, TextProps } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"
import { useWeb3React } from "@web3-react/core"
import { Body3, H5 } from "./Typography"
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
    <Box>
      <Stack direction="row">
        {icon && <Icon as={icon} boxSize={iconSize} alignSelf="center" />}
        <H5 {...restProps}>{shouldRenderTokenAmount ? _tokenAmount : "--"}</H5>
        {withSymbol && tokenSymbol && (
          <Body3 alignSelf="center">{tokenSymbol}</Body3>
        )}
      </Stack>
      {withUSDBalance && usdBalance && (
        <Body3 color="gray.500">{usdBalance}</Body3>
      )}
    </Box>
  )
}

export default TokenBalance
