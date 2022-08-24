import { BodySm, Box, HStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { Skeleton, Stack } from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"

const TransactionDetailsTable = () => {
  const {
    tBTCMintAmount,
    isLoadingTbtcMintAmount,
    ethGasCost,
    bitcoinMinerFee,
    isLoadingBitcoinMinerFee,
    thresholdNetworkFee,
    ethAddress,
  } = useTbtcState()
  return (
    <Stack spacing={2} mb={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">MintedAmount</BodySm>
        <Skeleton isLoaded={!isLoadingTbtcMintAmount}>
          <BodySm color="gray.700">{tBTCMintAmount} tBTC</BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Etheeum Gas Cost</BodySm>
        <BodySm color="gray.700">~{ethGasCost} gWEI</BodySm>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Threshold Network Fee</BodySm>
        <BodySm color="gray.700">{thresholdNetworkFee} BTC</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Bitcoin Minter Fee</BodySm>
        <Skeleton isLoaded={!isLoadingBitcoinMinerFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            {bitcoinMinerFee} BTC
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">tBTC</BodySm>
        <BodySm color="gray.700">1 BTC</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">ETH address</BodySm>
        <BodySm color="gray.700">{shortenAddress(ethAddress)}</BodySm>
      </HStack>
    </Stack>
  )
}

export default TransactionDetailsTable
