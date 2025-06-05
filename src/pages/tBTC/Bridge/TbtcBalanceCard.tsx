import { FC, ComponentProps, useMemo } from "react"
import TokenBalanceCard from "../../../components/TokenBalanceCard"
import { Token } from "../../../enums"
import { Card, Box, Text, HStack, Spinner } from "@threshold-network/components"
import { useStarknetTBTCBalance } from "../../../hooks/tbtc/useStarknetTBTCBalance"
import { useNonEVMConnection } from "../../../hooks/useNonEVMConnection"
import { ChainName } from "../../../threshold-ts/types"

export const TbtcBalanceCard: FC<ComponentProps<typeof Card>> = ({
  ...restProps
}) => {
  const { nonEVMChainName, isNonEVMActive } = useNonEVMConnection()
  const {
    balance: starknetBalance,
    isLoading,
    error,
  } = useStarknetTBTCBalance()

  const isStarknetConnected =
    isNonEVMActive && nonEVMChainName === ChainName.Starknet

  const additionalInfo = useMemo<React.ReactElement | undefined>(() => {
    if (!isStarknetConnected) return undefined

    if (isLoading) {
      return (
        <HStack spacing={2}>
          <Text fontSize="sm" color="gray.500">
            StarkNet:
          </Text>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500">
            Loading...
          </Text>
        </HStack>
      )
    }

    if (error) {
      return (
        <Text fontSize="sm" color="red.500">
          StarkNet: Error
        </Text>
      )
    }

    return (
      <Text fontSize="sm" color="gray.500">
        StarkNet: {starknetBalance} tBTC
      </Text>
    )
  }, [isStarknetConnected, isLoading, error, starknetBalance])

  return (
    <TokenBalanceCard
      token={Token.TBTCV2}
      title={
        <>
          <Box as="span" textTransform="lowercase">
            t
          </Box>
          btc balance
        </>
      }
      tokenSymbol={"tBTC"}
      withSymbol={true}
      withHigherPrecision={true}
      additionalInfo={additionalInfo}
      {...restProps}
    />
  )
}
