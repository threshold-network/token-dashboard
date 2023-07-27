import { List } from "@threshold-network/components"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"

const MintingTransactionDetails = () => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee, ethAddress } =
    useTbtcState()

  return (
    <List spacing="2" mb="6">
      <TransactionDetailsAmountItem
        label="Amount To Be Minted"
        tokenAmount={tBTCMintAmount}
        tokenSymbol="tBTC"
      />
      <TransactionDetailsAmountItem
        label="Minting Fee"
        tokenAmount={mintingFee}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
      />
      <TransactionDetailsAmountItem
        label="Threshold Network Fee"
        tokenAmount={thresholdNetworkFee}
        tokenSymbol="tBTC"
        precision={6}
        higherPrecision={8}
      />
      <TransactionDetailsItem
        label="ETH address"
        value={shortenAddress(ethAddress)}
      />
    </List>
  )
}

export default MintingTransactionDetails
