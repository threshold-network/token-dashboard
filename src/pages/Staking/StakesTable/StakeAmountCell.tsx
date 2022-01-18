import { FC, useMemo } from "react"
import { Badge, HStack, Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import TokenBalance from "../../../components/TokenBalance"
import { useT } from "../../../web3/hooks"
import { useTokenState } from "../../../hooks/useTokenState"
import getUsdBalance from "../../../utils/getUsdBalance"

const StakeAmountCell: FC<StakeCellProps> = ({ stake }) => {
  const { t } = useTokenState()
  const { usdConversion } = t

  const usdBalance = useMemo(
    () => getUsdBalance(stake.tStake, usdConversion),
    [usdConversion, stake.tStake]
  )

  return (
    <Td>
      <TokenBalance
        tokenAmount={stake.tStake}
        tokenSymbol="T"
        withSymbol
        withUSDBalance
        usdBalance={usdBalance}
      />
    </Td>
  )
}

export default StakeAmountCell
