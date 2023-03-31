import { ComponentProps, FC } from "react"
import { BodySm, List, ListItem, Skeleton } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { InlineTokenBalance } from "../../../../components/TokenBalance"

type TransactionDetailsItemProps = {
  label: string
  value?: string
}

export const TransactionDetailsItem: FC<TransactionDetailsItemProps> = ({
  label,
  value,
  children,
}) => {
  return (
    <ListItem display="flex" justifyContent="space-between" alignItems="center">
      <BodySm color="gray.500">{label}</BodySm>
      {value ? <BodySm color="gray.700">{value}</BodySm> : children}
    </ListItem>
  )
}

type TransactionDetailsAmountItemProps = Omit<
  ComponentProps<typeof InlineTokenBalance>,
  "tokenAmount"
> &
  Pick<TransactionDetailsItemProps, "label"> & { tokenAmount?: string }

export const TransactionDetailsAmountItem: FC<
  TransactionDetailsAmountItemProps
> = ({ label, tokenAmount, ...restProps }) => {
  return (
    <TransactionDetailsItem label={label}>
      <Skeleton isLoaded={!!tokenAmount}>
        <BodySm color="gray.700">
          <InlineTokenBalance
            withSymbol
            tokenAmount={tokenAmount || "0"}
            {...restProps}
          />
        </BodySm>
      </Skeleton>
    </TransactionDetailsItem>
  )
}

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
