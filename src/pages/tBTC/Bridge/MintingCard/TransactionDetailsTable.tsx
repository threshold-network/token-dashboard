import { BodySm, Box, HStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { Skeleton } from "@chakra-ui/react"
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
    <Box>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">MintedAmount</BodySm>
        <BodySm color="gray.700" display="flex" alignItems="center">
          <Skeleton
            mr={2}
            isLoaded={!isLoadingTbtcMintAmount}
            h="10px"
            w={isLoadingBitcoinMinerFee ? "55px" : undefined}
            display="inline-block"
          >
            {tBTCMintAmount}
          </Skeleton>{" "}
          tBTC
        </BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Etheeum Gas Cost</BodySm>
        <BodySm color="gray.700">~{ethGasCost} gWEI</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Threshold Network Fee</BodySm>
        <BodySm color="gray.700">{thresholdNetworkFee} BTC</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Bitcoin Minter Fee</BodySm>
        <BodySm color="gray.700" display="flex" alignItems="center">
          <Skeleton
            mr={2}
            isLoaded={!isLoadingBitcoinMinerFee}
            h="10px"
            w={isLoadingBitcoinMinerFee ? "55px" : undefined}
            display="inline-block"
          >
            {bitcoinMinerFee}
          </Skeleton>{" "}
          BTC
        </BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">tBTC</BodySm>
        <BodySm color="gray.700">1 BTC</BodySm>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">ETH address</BodySm>
        <BodySm color="gray.700">{shortenAddress(ethAddress)}</BodySm>
      </HStack>
    </Box>
  )
}

export default TransactionDetailsTable
