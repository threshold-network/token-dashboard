import { List } from "@threshold-network/components"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { useIsActive } from "../../../../hooks/useIsActive"
import { SupportedChainIds } from "../../../../networks/enums/networks"

const MintingTransactionDetails = () => {
  const {
    tBTCMintAmount,
    mintingFee,
    thresholdNetworkFee,
    ethAddress,
    crossChainFee,
  } = useTbtcState()
  const { chainId } = useIsActive()

  return (
    <List spacing="2" mb="6">
      <TransactionDetailsAmountItem
        label="Amount To Be Minted"
        amount={tBTCMintAmount}
        suffixItem="tBTC"
      />
      <TransactionDetailsAmountItem
        label="Minting Fee"
        amount={mintingFee}
        suffixItem="tBTC"
        precision={6}
        higherPrecision={8}
      />
      <TransactionDetailsAmountItem
        label="Threshold Network Fee"
        amount={thresholdNetworkFee}
        suffixItem="tBTC"
        precision={6}
        higherPrecision={8}
      />
      {chainId === SupportedChainIds.Arbitrum && (
        <TransactionDetailsAmountItem
          label="Cross Chain Fee"
          amount={crossChainFee}
          suffixItem="tBTC"
          precision={6}
          higherPrecision={8}
        />
      )}
      <TransactionDetailsItem
        label="ETH address"
        value={shortenAddress(ethAddress)}
      />
    </List>
  )
}

export default MintingTransactionDetails
