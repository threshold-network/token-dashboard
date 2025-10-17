import { List } from "@threshold-network/components"
import { TransactionDetailsAmountItem } from "../../../../components/TransactionDetails"

import { useFetchTBTCFees } from "../../../../hooks/tbtc/useFetchTBTCFees"
import { useIsActive } from "../../../../hooks/useIsActive"
import { SupportedChainIds } from "../../../../networks/enums/networks"

const TbtcFees = () => {
  const {
    data: { depositTreasuryFee, optimisticMintingFee, depositTxMaxFee },
    isFetching,
  } = useFetchTBTCFees()

  return (
    <List spacing="2" mb="6">
      <TransactionDetailsAmountItem
        label="Treasury Fee"
        amount={depositTreasuryFee}
        suffixItem="%"
        isFetching={isFetching}
      />
      <TransactionDetailsAmountItem
        label="Optimistic Minting Fee"
        amount={optimisticMintingFee}
        suffixItem="%"
        isFetching={isFetching}
      />
    </List>
  )
}

export default TbtcFees
