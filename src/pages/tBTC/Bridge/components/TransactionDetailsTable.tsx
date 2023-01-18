import { BodySm, HStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { Skeleton, Stack } from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../../utils/formatAmount"

const TransactionDetailsTable = () => {
  const {
    tBTCMintAmount,
    ethGasCost,
    bitcoinMinerFee,
    thresholdNetworkFee,
    ethAddress,
  } = useTbtcState()

  return (
    <Stack spacing={2} mb={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Minted Amount</BodySm>
        <Skeleton isLoaded={!!tBTCMintAmount}>
          <BodySm color="gray.700">
            {!!tBTCMintAmount
              ? formatTokenAmount(tBTCMintAmount, undefined, 8)
              : "0"}{" "}
            tBTC
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Estimated Ethereum Gas Cost</BodySm>
        <BodySm color="gray.700">~{ethGasCost} gWEI</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Bitcoin Miner Fee</BodySm>
        <Skeleton isLoaded={!!bitcoinMinerFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            {!!bitcoinMinerFee // TODO: remove trailing zeroes
              ? formatTokenAmount(bitcoinMinerFee, "00,0.000000", 8)
              : "0"}{" "}
            BTC
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Threshold Network Fee</BodySm>
        <Skeleton isLoaded={!!thresholdNetworkFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            {!!thresholdNetworkFee // TODO: remove trailing zeroes
              ? formatTokenAmount(thresholdNetworkFee, "00,0.000000", 8)
              : "0"}{" "}
            BTC
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
