import { BodySm, HStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { Skeleton, Stack } from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"
import { InlineTokenBalance } from "../../../../components/TokenBalance"

const TransactionDetailsTable = () => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee, ethAddress } =
    useTbtcState()

  return (
    <Stack spacing={2} mb={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Amount To Be Minted</BodySm>
        <Skeleton isLoaded={!!tBTCMintAmount}>
          <BodySm color="gray.700">
            <InlineTokenBalance
              tokenAmount={tBTCMintAmount}
              tokenSymbol="tBTC"
              withSymbol
            />
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Minting Fee</BodySm>
        <Skeleton isLoaded={!!mintingFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            <InlineTokenBalance
              tokenAmount={mintingFee}
              tokenSymbol="tBTC"
              withSymbol
              precision={6}
              higherPrecision={8}
            />
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Threshold Network Fee</BodySm>
        <Skeleton isLoaded={!!thresholdNetworkFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            <InlineTokenBalance
              tokenAmount={thresholdNetworkFee}
              tokenSymbol="tBTC"
              withSymbol
              precision={6}
              higherPrecision={8}
            />
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">ETH address</BodySm>
        <BodySm color="gray.700">{shortenAddress(ethAddress)}</BodySm>
      </HStack>
    </Stack>
  )
}

export default TransactionDetailsTable
