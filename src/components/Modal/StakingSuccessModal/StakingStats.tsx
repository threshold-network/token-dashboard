import { FC } from "react"
import { HStack, Stack } from "@chakra-ui/react"
import TokenBalance from "../../TokenBalance"
import { Body3 } from "../../Typography"

interface StakingStatsProps {
  stakeAmount: string | number
  operator: string
  beneficiary: string
  authorizer: string
}

const StakingStats: FC<StakingStatsProps> = ({
  stakeAmount,
  operator,
  beneficiary,
  authorizer,
}) => {
  const transactionInfo = [
    {
      text: "Stake Amount",
      // todo: Token might not be a string, so this should be updated once we decide on the interface
      value: (
        <TokenBalance
          tokenAmount={stakeAmount}
          withSymbol
          tokenSymbol="T"
          as="p"
          fontSize="sm"
          color="gray.700"
        />
      ),
    },
    {
      text: "Operator",
      value: <Body3 color="gray.700">{operator}</Body3>,
    },
    {
      text: "Beneficiary",
      value: <Body3 color="gray.700">{beneficiary}</Body3>,
    },
    {
      text: "Authorizer",
      value: <Body3 color="gray.700">{authorizer}</Body3>,
    },
  ]

  return (
    <Stack spacing="0.5rem">
      {transactionInfo.map((info) => (
        <HStack justify="space-between" key={info.text}>
          <Body3 color="gray.500">{info.text}</Body3>
          {info.value}
        </HStack>
      ))}
    </Stack>
  )
}

export default StakingStats
