import { List } from "@threshold-network/components"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"

const MintingTransactionDetails = () => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee, userWalletAddress } =
    useTbtcState()
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
      <TransactionDetailsItem
        label="ETH address"
        value={shortenAddress(userWalletAddress)}
      />
    </List>
  )
}

export default MintingTransactionDetails
