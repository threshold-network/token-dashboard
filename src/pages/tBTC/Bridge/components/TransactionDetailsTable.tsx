import { BodySm, HStack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { Skeleton, Stack } from "@chakra-ui/react"
import shortenAddress from "../../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../../utils/formatAmount"

const TransactionDetailsTable = () => {
  const { tBTCMintAmount, mintingFee, thresholdNetworkFee, ethAddress } =
    useTbtcState()

  return (
    <Stack spacing={2} mb={6}>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Amount To Be Minted</BodySm>
        <Skeleton isLoaded={!!tBTCMintAmount}>
          <BodySm color="gray.700">
            {!!tBTCMintAmount ? formatTokenAmount(tBTCMintAmount) : "0"} tBTC
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between">
        <BodySm color="gray.500">Minting Fee</BodySm>
        <Skeleton isLoaded={!!mintingFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            {!!mintingFee ? formatTokenAmount(mintingFee) : "0"} tBTC
          </BodySm>
        </Skeleton>
      </HStack>
      <HStack justifyContent="space-between" alignItems="center">
        <BodySm color="gray.500">Threshold Network Fee</BodySm>
        <Skeleton isLoaded={!!thresholdNetworkFee}>
          <BodySm color="gray.700" display="flex" alignItems="center">
            {!!thresholdNetworkFee
              ? formatTokenAmount(thresholdNetworkFee)
              : "0"}{" "}
            tBTC
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
