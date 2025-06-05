import { List } from "@threshold-network/components"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../../components/TransactionDetails"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { useIsActive } from "../../../../hooks/useIsActive"
import { SupportedChainIds } from "../../../../networks/enums/networks"
import { useNonEVMConnection } from "../../../../hooks/useNonEVMConnection"
import { ChainName } from "../../../../threshold-ts/types"

const MintingTransactionDetails = () => {
  const {
    tBTCMintAmount,
    mintingFee,
    thresholdNetworkFee,
    ethAddress,
    crossChainFee,
    chainName,
  } = useTbtcState()

  const { isNonEVMActive, nonEVMChainName, nonEVMPublicKey } =
    useNonEVMConnection()
  const isStarkNetDeposit =
    isNonEVMActive && nonEVMChainName === ChainName.Starknet
  const starknetAddress = isStarkNetDeposit ? nonEVMPublicKey : undefined

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
      {isStarkNetDeposit && crossChainFee && (
        <TransactionDetailsAmountItem
          label="Cross-Chain Fee"
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
      {isStarkNetDeposit && starknetAddress && (
        <TransactionDetailsItem
          label="StarkNet Recipient"
          value={shortenAddress(starknetAddress)}
        />
      )}
    </List>
  )
}

export default MintingTransactionDetails
