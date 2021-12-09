import { FC, useMemo } from "react"
import { Box } from "@chakra-ui/react"
import { formatUnits } from "@ethersproject/units"
import numeral from "numeral"
import { Body3, H5 } from "./Typography"

interface TokenBalanceProps {
  tokenAmount: string | number
  usdBalance?: string
  tokenSymbol?: string
  withUSDBalance?: boolean
  withSymbol?: boolean
}

const TokenBalance: FC<TokenBalanceProps> = ({
  tokenAmount,
  usdBalance,
  tokenSymbol,
  withUSDBalance = false,
  withSymbol = false,
}) => {
  const _tokenAmount = useMemo(() => {
    return numeral(formatUnits(tokenAmount)).format("0,0.00")
  }, [tokenAmount])

  // TODO: more flexible approach to style wrapper, token balance and USD
  // balance.
  return (
    <Box>
      <H5>
        {`${tokenAmount ? _tokenAmount : "--"}${
          withSymbol && tokenSymbol ? ` ${tokenSymbol}` : ""
        }`}
      </H5>
      {withUSDBalance && usdBalance && (
        <Body3 color="gray.500">{usdBalance}</Body3>
      )}
    </Box>
  )
}

export default TokenBalance
