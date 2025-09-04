import { List } from "@threshold-network/components"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { useIsActive } from "../../../../hooks/useIsActive"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { getChainDisplayInfo } from "../../../../utils/chainTextUtils"

const MintingTransactionDetails = () => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee, userWalletAddress } =
    useTbtcState()
  const { chainId } = useIsActive()
  const { nonEVMChainName } = useNonEVMConnection()

  const chainInfo = getChainDisplayInfo(nonEVMChainName, chainId)

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
        label={chainInfo.recipientLabel}
        value={shortenAddress(userWalletAddress)}
      />
    </List>
  )
}

export default MintingTransactionDetails
