import { List } from "@threshold-network/components"
import { TransactionDetailsAmountItem } from "../../../../components/TransactionDetails"

import { useFetchTBTCFees } from "../../../../hooks/tbtc/useFetchTBTCFees"
import { useIsActive } from "../../../../hooks/useIsActive"
import { SupportedChainIds } from "../../../../networks/enums/networks"

const TbtcFees = () => {
  const {
    data: { depositTreasuryFeeDivisor, depositRevealedTxHash, depositTxMaxFee },
  } = useFetchTBTCFees()

  const { chainId } = useIsActive()

  return (
    <List spacing="2" mb="6">
      <TransactionDetailsAmountItem
        label="Treasury Fee"
        tokenAmount={depositTreasuryFeeDivisor}
        tokenSymbol="tBTC"
      />
      <TransactionDetailsAmountItem
        label="Revealed Tx Hash"
        tokenAmount={depositRevealedTxHash}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
      />
      {(chainId === SupportedChainIds.Arbitrum ||
        chainId === SupportedChainIds.ArbitrumSepolia) && (
        <TransactionDetailsAmountItem
          label="Cross Chain Fee"
          tokenAmount={depositTxMaxFee}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
      )}
    </List>
  )
}

export default TbtcFees
