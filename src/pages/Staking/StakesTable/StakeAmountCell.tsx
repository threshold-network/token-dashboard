import { FC, useMemo } from "react"
import { Td } from "@chakra-ui/react"
import { StakeCellProps } from "../../../types/staking"
import TokenBalance from "../../../components/TokenBalance"
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
        icon={t.icon}
        iconSize="24px"
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
